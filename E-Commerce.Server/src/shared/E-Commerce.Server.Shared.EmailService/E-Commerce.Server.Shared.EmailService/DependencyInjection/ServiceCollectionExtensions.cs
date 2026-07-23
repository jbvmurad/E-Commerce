using E_Commerce.Server.Shared.EmailService.Options;
using E_Commerce.Server.Shared.EmailService.Renderers;
using E_Commerce.Server.Shared.EmailService.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace E_Commerce.Server.Shared.EmailService.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddECommerceEmail(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var emailOptions = configuration.GetSection("EmailParameters").Get<EmailOptions>();
        if (emailOptions is not null)
            services.AddSingleton(emailOptions);

        var templateOptions = configuration.GetSection("ClientAppUrls").Get<EmailTemplateOptions>();
        if (templateOptions is not null)
            services.AddSingleton(templateOptions);

        services.AddSingleton<IEmailTemplateRenderer, EmbeddedTemplateRenderer>();
        services.AddScoped<IEmailService, DefaultEmailService>();

        return services;
    }
}
