using ApiGateway.Configurations;
using ApiGateway.Configurations.Abstraction;
using ApiGateway.Configurations.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.InstallServices(
    builder.Configuration,
    builder.Host,
    typeof(IServiceInstaller).Assembly);

var app = builder.Build();
app.UseConfiguredGateway();
app.Run();
