using System.Collections.Concurrent;
using System.Globalization;
using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace E_Commerce.Server.Shared.Localization.Localizations;

public sealed class LocalizationService : ILocalizationService
{
    private const string DefaultLanguage = "az";
    private static readonly string[] SupportedLanguages = { "az", "en", "ru", "tr" };
    private static readonly ConcurrentDictionary<string, Dictionary<string, string>> _translations = new();
    private static bool _initialized;
    private static readonly object _lock = new();
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LocalizationService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        EnsureInitialized();
    }

    public string Get(string key)
    {
        var language = ResolveLanguage();
        return ResolveValue(key, language);
    }

    public string Get(string key, params object[] args)
    {
        var value = Get(key);
        return FormatValue(value, args);
    }

    public string GetWithLanguage(string key, string language)
    {
        var lang = ResolveLanguage(language);
        return ResolveValue(key, lang);
    }

    public string GetWithLanguage(string key, string language, params object[] args)
    {
        var value = GetWithLanguage(key, language);
        return FormatValue(value, args);
    }

    public string GetCurrentLanguage() => ResolveLanguage();


    private static string FormatValue(string value, object[] args)
    {
        if (args.Length == 0) return value;
        try { return string.Format(value, args); }
        catch (FormatException)
        {
            var result = value;
            var matches = System.Text.RegularExpressions.Regex.Matches(value, "\\{[A-Za-z][A-Za-z0-9_]*\\}").Select(m => m.Value).Distinct().ToArray();
            for (var i = 0; i < matches.Length && i < args.Length; i++) result = result.Replace(matches[i], args[i]?.ToString());
            return result;
        }
    }

    private string ResolveValue(string key, string language)
    {
        if (_translations.TryGetValue(language, out var langDict) && langDict.TryGetValue(key, out var value))
            return value;

        if (language != DefaultLanguage
            && _translations.TryGetValue(DefaultLanguage, out var azDict)
            && azDict.TryGetValue(key, out var fallbackValue))
            return fallbackValue;

        foreach (var lang in SupportedLanguages)
        {
            if (_translations.TryGetValue(lang, out var dict) && dict.TryGetValue(key, out var val))
                return val;
        }

        return key;
    }

    private string ResolveLanguage(string? preferred = null)
    {
        if (!string.IsNullOrWhiteSpace(preferred) && SupportedLanguages.Contains(preferred, StringComparer.OrdinalIgnoreCase))
            return preferred.ToLowerInvariant();

        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext is not null)
        {
            var acceptLang = httpContext.Request.Headers["Accept-Language"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(acceptLang))
            {
                foreach (var part in acceptLang.Split(','))
                {
                    var langCode = part.Split(';')[0].Trim().Split('-')[0].ToLowerInvariant();
                    if (SupportedLanguages.Contains(langCode))
                        return langCode;
                }
            }

            var cookieLang = httpContext.Request.Cookies["lang"];
            if (!string.IsNullOrWhiteSpace(cookieLang) && SupportedLanguages.Contains(cookieLang, StringComparer.OrdinalIgnoreCase))
                return cookieLang.ToLowerInvariant();

            var queryLang = httpContext.Request.Query["lang"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(queryLang) && SupportedLanguages.Contains(queryLang, StringComparer.OrdinalIgnoreCase))
                return queryLang.ToLowerInvariant();
        }

        var culture = CultureInfo.CurrentUICulture;
        var cultureCode = culture.TwoLetterISOLanguageName;
        if (SupportedLanguages.Contains(cultureCode))
            return cultureCode;

        return DefaultLanguage;
    }

    private static void EnsureInitialized()
    {
        if (_initialized) return;
        lock (_lock)
        {
            if (_initialized) return;

            var assembly = Assembly.GetExecutingAssembly();
            foreach (var lang in SupportedLanguages)
            {
                var resourceName = $"E-Commerce.Server.Shared.Localization.Resources.{lang}.json";
                try
                {
                    using var stream = assembly.GetManifestResourceStream(resourceName);
                    if (stream is null) continue;

                    using var reader = new StreamReader(stream);
                    var json = reader.ReadToEnd();
                    var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
                    if (dict is not null)
                        _translations[lang] = new Dictionary<string, string>(dict, StringComparer.OrdinalIgnoreCase);
                }
                catch
                {
                }
            }

            _initialized = true;
        }
    }
}
