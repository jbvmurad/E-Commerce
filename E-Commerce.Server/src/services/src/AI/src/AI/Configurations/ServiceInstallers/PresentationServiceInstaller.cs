using AI.API.Configurations.Abstraction;
using E_Commerce.Server.Shared.Middleware.BearerSecurityScheme;
using Microsoft.AspNetCore.OData;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class PresentationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services
            .AddControllers()
            .AddApplicationPart(typeof(AI.Presentation.AssemblyReference).Assembly)
            .AddOData(options => options
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
