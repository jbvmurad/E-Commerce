using AI.Infrastructure.Gemini;
using E_Commerce.Server.Shared.AI.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace AI.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddAIInfrastructure(
        this IServiceCollection services)
    {
        services.AddHttpClient<IAiProvider, GeminiAiProvider>(client =>
        {
            client.Timeout = Timeout.InfiniteTimeSpan;
        });

        return services;
    }
}
