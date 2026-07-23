using AI.API.Configurations;
using AI.API.Configurations.Abstraction;
using AI.API.Configurations.Extensions;
using E_Commerce.Server.Shared.Logging.Serilog;
using Serilog;

try
{
    Log.Logger = new LoggerConfiguration()
        .WriteTo.Console()
        .CreateBootstrapLogger();

    var builder = WebApplication.CreateBuilder(args);

    builder.Services.InstallServices(
        builder.Configuration,
        builder.Host,
        typeof(IServiceInstaller).Assembly);

    builder.AddAppSerilog("AIConnection");

    var app = builder.Build();
    app.UseConfiguredApi();
    app.Run();
}
catch (Exception exception)
{
    Log.Fatal(exception, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
