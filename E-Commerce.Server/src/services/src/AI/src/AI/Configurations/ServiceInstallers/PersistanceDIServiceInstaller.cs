using AI.API.Configurations.Abstraction;
using AI.Application.Services.AIAttributeServices;
using AI.Domain.Repositories.AIAttributeRepositories;
using AI.Persistance.Repositories.AIAttributeRepositories;
using AI.Persistance.Services.AIAttributeServices;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class PersistanceDIServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddHttpContextAccessor();

        services.AddScoped<IAIChatService, AIChatService>();
        services.AddScoped<IAIConversationService, AIConversationService>();
        services.AddScoped<IAIConversationRepository, AIConversationRepository>();
        services.AddScoped<IAIMessageRepository, AIMessageRepository>();
        services.AddScoped<IAIAttachmentRepository, AIAttachmentRepository>();
    }
}
