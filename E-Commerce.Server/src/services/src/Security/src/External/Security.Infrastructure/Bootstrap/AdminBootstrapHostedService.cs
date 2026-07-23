using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Security.Infrastructure.Bootstrap;

public sealed class AdminBootstrapHostedService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IOptions<AdminBootstrapOptions> _options;
    private readonly ILogger<AdminBootstrapHostedService> _logger;

    public AdminBootstrapHostedService(
        IServiceProvider serviceProvider,
        IOptions<AdminBootstrapOptions> options,
        ILogger<AdminBootstrapHostedService> logger)
    {
        _serviceProvider = serviceProvider;
        _options = options;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.Value.Email) || string.IsNullOrWhiteSpace(_options.Value.Password))
        {
            _logger.LogWarning(
                "{SectionName} configuration is incomplete. Admin bootstrap was skipped.",
                AdminBootstrapOptions.SectionName);
            return;
        }

        await using var scope = _serviceProvider.CreateAsyncScope();

        var bootstrapService = scope.ServiceProvider.GetRequiredService<AdminBootstrapService>();
        await bootstrapService.EnsureAdminAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;
}
