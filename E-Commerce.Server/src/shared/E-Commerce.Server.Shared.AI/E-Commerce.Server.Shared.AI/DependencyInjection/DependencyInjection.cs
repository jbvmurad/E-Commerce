using E_Commerce.Server.Shared.AI.Options;
using E_Commerce.Server.Shared.AI.Validation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.AI.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddSharedAI(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.TryAddEnumerable(
            ServiceDescriptor.Singleton<IValidateOptions<AiOptions>, AiOptionsValidator>());

        services
            .AddOptions<AiOptions>()
            .Bind(configuration.GetSection(AiOptions.SectionName))
            .ValidateOnStart();

        services.AddScoped<AiRequestValidator>();

        return services;
    }
}
