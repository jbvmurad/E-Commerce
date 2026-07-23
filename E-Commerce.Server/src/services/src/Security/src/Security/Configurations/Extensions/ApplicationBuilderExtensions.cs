using E_Commerce.Server.Shared.Authorization.RateLimiting;
using E_Commerce.Server.Shared.Middleware.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;
using Security.Persistance.Context;
using Serilog;

namespace Security.API.Configurations.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseConfiguredApi(this WebApplication app)
    {
        app.UseSerilogRequestLogging();
        app.UseSharedHttpMetrics();

        ApplyMigrationsOnStartup(app);
        MapApiDocumentation(app);
        MapDefaultEndpoints(app, "Security.API");
        UseOptionalHttpsRedirection(app);
        UseLocalUploads(app);

        app.UseAuthentication();
        app.UseAuthRateLimitRequestIdentity();
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
        var db = scope.ServiceProvider.GetRequiredService<SecurityContext>();
        db.Database.Migrate();
    }

    private static void MapApiDocumentation(WebApplication app)
    {
        var openApiEnabled = app.Configuration.GetValue("OpenApi:Enabled", false) || app.Environment.IsDevelopment();
        if (!openApiEnabled)
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
        var storageProvider = app.Configuration["Storage:Provider"] ?? "Local";
        if (!storageProvider.Equals("Local", StringComparison.OrdinalIgnoreCase))
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
