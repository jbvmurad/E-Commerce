using E_Commerce.Server.Shared.Logging.Serilog;
using Security.API.Configurations;
using Security.API.Configurations.Abstraction;
using Security.API.Configurations.Extensions;
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

    builder.AddAppSerilog("SecurityConnection");

    var app = builder.Build();
    app.UseConfiguredApi();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
