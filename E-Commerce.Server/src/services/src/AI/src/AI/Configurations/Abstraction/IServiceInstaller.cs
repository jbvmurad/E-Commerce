namespace AI.API.Configurations.Abstraction;

public interface IServiceInstaller
{
    void Install(
        IServiceCollection services,
        IConfiguration configuration,
        IHostBuilder host);
}
