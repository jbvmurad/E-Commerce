using AI.Persistance.Context;
using E_Commerce.Server.Shared.Middleware.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;
using Serilog;

namespace AI.API.Configurations.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseConfiguredApi(this WebApplication app)
    {
        app.UseSerilogRequestLogging();
        app.UseSharedHttpMetrics();

        ApplyMigrationsOnStartup(app);
        MapApiDocumentation(app);
        MapDefaultEndpoints(app, "AI.API");
        UseOptionalHttpsRedirection(app);
        UseLocalUploads(app);

        app.UseAuthentication();
        app.UseRateLimiter();
        app.UseAuthorization();
        app.UseSharedExceptionMiddleware();
        app.MapControllers();
        app.MapPrometheusMetrics();

        return app;
    }

    private static void ApplyMigrationsOnStartup(WebApplication app)
    {
        if (!app.Configuration.GetValue("Database:MigrateOnStartup", false))
            return;

        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AIContext>();
        context.Database.Migrate();
    }

    private static void MapApiDocumentation(WebApplication app)
    {
        var enabled = app.Configuration.GetValue("OpenApi:Enabled", false) || app.Environment.IsDevelopment();
        if (!enabled)
            return;

        app.MapOpenApi();
        app.MapScalarApiReference(options => options
            .AddPreferredSecuritySchemes("Bearer")
            .EnablePersistentAuthentication());
    }

    private static void MapDefaultEndpoints(WebApplication app, string serviceName)
    {
        app.MapGet("/", () => Results.Ok(new { service = serviceName, status = "ok" }));
        app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
    }

    private static void UseOptionalHttpsRedirection(WebApplication app)
    {
        if (app.Configuration.GetValue("HttpsRedirection:Enabled", true))
            app.UseHttpsRedirection();
    }

    private static void UseLocalUploads(WebApplication app)
    {
        var provider = app.Configuration["Storage:Provider"] ?? "Local";
        if (!provider.Equals("Local", StringComparison.OrdinalIgnoreCase))
            return;

        var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsPath);

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(uploadsPath),
            RequestPath = "/uploads"
        });
    }
}
