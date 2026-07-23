using E_Commerce.Server.Shared.Contracts.Events;
using JasperFx.Resources;
using Security.Infrastructure.Options;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Postgresql;
using Wolverine.RabbitMQ;

namespace Security.API.Configurations.ServiceInstallers;

public static class WolverineMessagingServiceInstaller
{
    public static void ConfigureRabbitMqMessaging(this WolverineOptions opts, IConfiguration configuration)
    {
        var rabbit = configuration.GetSection("RabbitMq").Get<RabbitMqOptions>() ?? new RabbitMqOptions();

        var injected = configuration.GetConnectionString("rabbitmq");
        if (!string.IsNullOrWhiteSpace(injected))
            rabbit.ConnectionString = injected;

        var defaultUser = configuration["RABBITMQ_DEFAULT_USER"];
        var defaultPass = configuration["RABBITMQ_DEFAULT_PASS"];
        if (!string.IsNullOrWhiteSpace(defaultUser)) rabbit.Username = defaultUser;
        if (!string.IsNullOrWhiteSpace(defaultPass)) rabbit.Password = defaultPass;

        if (!rabbit.Enabled)
            return;

        ConfigureTransactionalOutbox(opts, configuration);

        var uri = BuildAmqpUri(rabbit);

        opts.UseRabbitMq(new Uri(uri)).AutoProvision();
        opts.Services.AddResourceSetupOnStartup();

        opts.ListenToRabbitQueue("security.email");

        opts.PublishMessage<EmailConfirmationRequestedIntegrationEvent>().ToRabbitQueue("security.email");
        opts.PublishMessage<PasswordResetRequestedIntegrationEvent>().ToRabbitQueue("security.email");
        opts.PublishMessage<AccountDeletedIntegrationEvent>().ToRabbitQueue("security.email");
        opts.PublishMessage<AccountDeletedIntegrationEvent>().ToRabbitQueue("notification.accounts");
        opts.PublishMessage<EmailChangeRequestedIntegrationEvent>().ToRabbitQueue("security.email");
        opts.PublishMessage<EmailChangeNotificationIntegrationEvent>().ToRabbitQueue("security.email");
    }

    private static void ConfigureTransactionalOutbox(WolverineOptions opts, IConfiguration configuration)
    {
        var postgres = configuration.GetConnectionString("SecurityConnection");
        if (string.IsNullOrWhiteSpace(postgres))
            return;

        opts.PersistMessagesWithPostgresql(postgres, schemaName: "wolverine");
        opts.UseEntityFrameworkCoreTransactions();
        opts.Policies.AutoApplyTransactions();
        opts.Policies.UseDurableOutboxOnAllSendingEndpoints();
        opts.Policies.UseDurableInboxOnAllListeners();
    }

    private static string BuildAmqpUri(RabbitMqOptions rabbit)
    {
        if (!string.IsNullOrWhiteSpace(rabbit.ConnectionString))
        {
            var raw = rabbit.ConnectionString.Trim();

            if (!raw.Contains("://", StringComparison.Ordinal))
                raw = $"amqp://{raw}";

            if (raw.StartsWith("rabbitmq://", StringComparison.OrdinalIgnoreCase))
                raw = "amqp://" + raw.Substring("rabbitmq://".Length);

            return raw;
        }

        var vhost = string.IsNullOrWhiteSpace(rabbit.VirtualHost) || rabbit.VirtualHost == "/"
            ? "%2F"
            : Uri.EscapeDataString(rabbit.VirtualHost.TrimStart('/'));

        return $"amqp://{Uri.EscapeDataString(rabbit.Username)}:{Uri.EscapeDataString(rabbit.Password)}@{rabbit.Host}:{rabbit.Port}/{vhost}";
    }
}
