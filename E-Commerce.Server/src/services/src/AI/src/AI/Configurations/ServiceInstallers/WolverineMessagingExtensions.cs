using AI.Persistance.Context;
using JasperFx.Resources;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Postgresql;
using Wolverine.RabbitMQ;

namespace AI.API.Configurations.ServiceInstallers;

internal static class WolverineMessagingExtensions
{
    public static void ConfigureRabbitMqMessaging(this WolverineOptions options, IConfiguration configuration)
    {
        var enabled = configuration.GetValue("RabbitMq:Enabled", true);
        if (!enabled)
            return;

        ConfigureTransactionalOutbox(options, configuration);

        var uri = BuildAmqpUri(configuration);
        options.UseRabbitMq(new Uri(uri)).AutoProvision();
        options.Services.AddResourceSetupOnStartup();
    }

    private static void ConfigureTransactionalOutbox(WolverineOptions options, IConfiguration configuration)
    {
        var postgres = configuration.GetConnectionString("AIConnection");
        if (string.IsNullOrWhiteSpace(postgres))
            return;

        options.PersistMessagesWithPostgresql(postgres, schemaName: "wolverine");
        options.UseEntityFrameworkCoreTransactions();
        options.Policies.AutoApplyTransactions();
        options.Policies.UseDurableOutboxOnAllSendingEndpoints();
        options.Policies.UseDurableInboxOnAllListeners();
    }

    private static string BuildAmqpUri(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("rabbitmq")
            ?? configuration["RabbitMq:ConnectionString"];

        if (!string.IsNullOrWhiteSpace(connectionString))
        {
            var raw = connectionString.Trim();
            if (!raw.Contains("://", StringComparison.Ordinal))
                raw = $"amqp://{raw}";

            if (raw.StartsWith("rabbitmq://", StringComparison.OrdinalIgnoreCase))
                raw = "amqp://" + raw["rabbitmq://".Length..];

            return raw;
        }

        var host = configuration["RabbitMq:Host"] ?? "localhost";
        var port = configuration.GetValue("RabbitMq:Port", 5672);
        var username = configuration["RABBITMQ_DEFAULT_USER"] ?? configuration["RabbitMq:Username"] ?? "guest";
        var password = configuration["RABBITMQ_DEFAULT_PASS"] ?? configuration["RabbitMq:Password"] ?? "guest";
        var virtualHost = configuration["RabbitMq:VirtualHost"];
        var vhost = string.IsNullOrWhiteSpace(virtualHost) || virtualHost == "/"
            ? "%2F"
            : Uri.EscapeDataString(virtualHost.TrimStart('/'));

        return $"amqp://{Uri.EscapeDataString(username)}:{Uri.EscapeDataString(password)}@{host}:{port}/{vhost}";
    }
}
