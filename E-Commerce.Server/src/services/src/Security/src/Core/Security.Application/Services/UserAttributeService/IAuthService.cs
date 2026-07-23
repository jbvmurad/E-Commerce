using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangeEmail;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangePassword;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmail;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmailChange;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.CreateNewTokenByRefreshToken;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.DeleteUser;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ForgotPassword;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ExternalLogin;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Login;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Logout;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.RegisterUser;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResendEmailConfirmation;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResetPassword;
using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;

namespace Security.Application.Services.UserAttributeService;

public interface IAuthService
{
    Task RegisterAsync(RegisterUserCommand request);
    Task ConfirmEmailAsync(ConfirmEmailCommand request, CancellationToken cancellationToken);
    Task ResendEmailConfirmationAsync(ResendEmailConfirmationCommand request, CancellationToken cancellationToken);
    Task ForgotPasswordAsync(ForgotPasswordCommand request, CancellationToken cancellationToken);
    Task ResetPasswordAsync(ResetPasswordCommand request, CancellationToken cancellationToken);
    Task<LoginCommandResponse> LoginAsync(LoginCommand request, CancellationToken cancellationToken);
    Task<ExternalLoginCommandResponse> ExternalLoginAsync(ExternalLoginCommand request, CancellationToken cancellationToken);
    Task<LoginCommandResponse> CreateTokenByRefreshTokenAsync(
        CreateNewTokenByRefreshTokenCommand request, CancellationToken cancellationToken);
    Task LogoutAsync(LogoutCommand request, CancellationToken cancellationToken);
    IQueryable<User> GetAllUsers();
    Task DeleteAsync(DeleteUserCommand request, CancellationToken cancellationToken);
    Task RequestEmailChangeAsync(ChangeEmailCommand request, CancellationToken cancellationToken);
    Task ConfirmEmailChangeAsync(ConfirmEmailChangeCommand request, CancellationToken cancellationToken);
    Task ChangePasswordAsync(ChangePasswordCommand request, CancellationToken cancellationToken);
}
