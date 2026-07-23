using E_Commerce.Server.Shared.Middleware.BearerSecurityScheme;
using Microsoft.AspNetCore.OData;
using Security.API.Configurations.Abstraction;
using Security.Presentation.Services.AuthCookies;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class PresentationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddScoped<IAuthCookieService, AuthCookieService>();

        services
            .AddControllers()
            .AddApplicationPart(typeof(Security.Presentation.AssemblyReference).Assembly)
            .AddOData(opt => opt
                .Select()
                .Filter()
                .OrderBy()
                .Expand()
                .Count()
                .SetMaxTop(200)
            );

        services.AddEndpointsApiExplorer();
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
        });
    }
}
