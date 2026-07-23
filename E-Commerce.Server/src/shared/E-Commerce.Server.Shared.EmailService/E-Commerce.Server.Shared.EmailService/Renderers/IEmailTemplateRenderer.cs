namespace E_Commerce.Server.Shared.EmailService.Renderers;

public interface IEmailTemplateRenderer
{
    Task<string> RenderAsync(string templateName, object model);
}
