using E_Commerce.Server.Shared.Localization.Localizations;
using Microsoft.Extensions.DependencyInjection;

namespace E_Commerce.Server.Shared.Localization.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddECommerceLocalization(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddSingleton<ILocalizationService, LocalizationService>();
        return services;
    }
}
