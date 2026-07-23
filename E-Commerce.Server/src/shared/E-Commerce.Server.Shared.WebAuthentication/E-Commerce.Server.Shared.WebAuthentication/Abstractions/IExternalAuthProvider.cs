using E_Commerce.Server.Shared.ExternalAuthentication.Contracts;

namespace E_Commerce.Server.Shared.ExternalAuthentication.Abstractions;

public interface IExternalAuthProvider
{
    string ProviderName { get; }

    Task<ExternalUserInfo> ValidateAsync(
        ExternalAuthCredential credential,
        CancellationToken cancellationToken = default);
}
