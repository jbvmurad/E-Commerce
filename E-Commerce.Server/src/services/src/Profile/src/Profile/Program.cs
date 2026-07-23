using E_Commerce.Server.Shared.Logging.Serilog;
using Profile.API.Configurations;
using Profile.API.Configurations.Abstraction;
using Profile.API.Configurations.Extensions;
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

    builder.AddAppSerilog("ProfileConnection");

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
