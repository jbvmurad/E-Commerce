using System.Reflection;
using System.Text.RegularExpressions;

namespace E_Commerce.Server.Shared.EmailService.Renderers;

public sealed class EmbeddedTemplateRenderer : IEmailTemplateRenderer
{
    private static readonly Assembly Assembly = typeof(EmbeddedTemplateRenderer).Assembly;
    private static readonly string RootNamespace = Assembly.GetName().Name!;

    public async Task<string> RenderAsync(string templateName, object model)
    {
        var layout = await LoadTemplateAsync("Templates.Layouts._Layout");
        var content = await LoadTemplateAsync($"Templates.Emails.{templateName}");

        var properties = model.GetType().GetProperties()
            .ToDictionary(p => p.Name, p => p.GetValue(model)?.ToString() ?? string.Empty);

        var body = Regex.Replace(content, @"\{\{(\w+)\}\}", m =>
            properties.TryGetValue(m.Groups[1].Value, out var val) ? val : m.Value);

        var result = layout.Replace("{{Body}}", body);

        return result;
    }

    private static async Task<string> LoadTemplateAsync(string resourcePath)
    {
        var fullPath = $"{RootNamespace}.{resourcePath}.html";
        using var stream = Assembly.GetManifestResourceStream(fullPath)
            ?? throw new InvalidOperationException($"Template not found: {fullPath}");
        using var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }
}
