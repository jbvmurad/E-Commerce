using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using NpgsqlTypes;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.Grafana.Loki;
using Serilog.Sinks.PostgreSQL;
using Serilog.Sinks.PostgreSQL.ColumnWriters;
namespace E_Commerce.Server.Shared.Logging.Serilog;

public static class SerilogSetup
{
    public static void AddAppSerilog(this WebApplicationBuilder builder, string connectionStringName)
    {
        var connectionString = builder.Configuration.GetConnectionString(connectionStringName)
            ?? throw new InvalidOperationException($"Connection string '{connectionStringName}' not found.");

        var columnWriters = new Dictionary<string, ColumnWriterBase>
        {
            ["message"] = new RenderedMessageColumnWriter(NpgsqlDbType.Text),
            ["message_template"] = new MessageTemplateColumnWriter(NpgsqlDbType.Text),
            ["level"] = new LevelColumnWriter(true, NpgsqlDbType.Varchar),
            ["raise_date"] = new TimestampColumnWriter(NpgsqlDbType.Timestamp),
            ["exception"] = new ExceptionColumnWriter(NpgsqlDbType.Text),
            ["properties"] = new LogEventSerializedColumnWriter(NpgsqlDbType.Jsonb),
            ["machine_name"] = new SinglePropertyColumnWriter("MachineName", PropertyWriteMethod.ToString, NpgsqlDbType.Text)
        };

        builder.Host.UseSerilog((ctx, services, lc) =>
        {
            lc
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .Enrich.WithMachineName()
                .Enrich.WithProperty("Service", builder.Environment.ApplicationName)
                .WriteTo.Console()
                .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
                .WriteTo.PostgreSQL(
                    connectionString: connectionString,
                    tableName: "logs",
                    columnOptions: columnWriters,
                    needAutoCreateTable: true
                );

            var lokiUrl = builder.Configuration["Loki:Url"];
            if (!string.IsNullOrWhiteSpace(lokiUrl))
            {
                lc.WriteTo.GrafanaLoki(
                    lokiUrl,
                    labels: new[] { new LokiLabel { Key = "service", Value = builder.Environment.ApplicationName } });
            }
        });
    }

    public static void AddAppSerilogWithoutDatabase(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((ctx, services, lc) =>
        {
            lc
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .Enrich.WithMachineName()
                .Enrich.WithProperty("Service", builder.Environment.ApplicationName)
                .WriteTo.Console()
                .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day);

            var lokiUrl = builder.Configuration["Loki:Url"];
            if (!string.IsNullOrWhiteSpace(lokiUrl))
            {
                lc.WriteTo.GrafanaLoki(
                    lokiUrl,
                    labels: new[] { new LokiLabel { Key = "service", Value = builder.Environment.ApplicationName } });
            }
        });
    }
}
