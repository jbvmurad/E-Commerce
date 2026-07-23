namespace E_Commerce.Server.Shared.Localization.Localizations;

public interface ILocalizationService
{
    string Get(string key);
    string Get(string key, params object[] args);
    string GetWithLanguage(string key, string language);
    string GetWithLanguage(string key, string language, params object[] args);
    string GetCurrentLanguage();
}
