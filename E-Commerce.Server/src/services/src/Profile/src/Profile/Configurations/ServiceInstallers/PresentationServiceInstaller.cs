using E_Commerce.Server.Shared.Middleware.BearerSecurityScheme;
using Microsoft.AspNetCore.OData;
using Profile.API.Configurations.Abstraction;

namespace Profile.API.Configurations.ServiceInstallers;

public sealed class PresentationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services
            .AddControllers()
            .AddApplicationPart(typeof(Profile.Presentation.AssemblyReference).Assembly)
            .AddOData(opt => opt
                .Select()
                .Filter()
                .OrderBy()
                .Expand()
                .Count()
                .SetMaxTop(200));

        services.AddEndpointsApiExplorer();
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
        });
    }
}
