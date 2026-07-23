namespace E_Commerce.Server.Shared.Authorization.RateLimiting;

public static class AuthRateLimitPolicies
{
    public const string Login = "auth-login";
    public const string Register = "auth-register";
    public const string ConfirmEmail = "auth-confirm-email";
    public const string ResendConfirmationEmail = "auth-resend-confirmation-email";
    public const string ForgotPassword = "auth-forgot-password";
    public const string ResetPassword = "auth-reset-password";
    public const string RefreshToken = "auth-refresh-token";
    public const string Logout = "auth-logout";
    public const string ChangeEmail = "auth-change-email";
    public const string ConfirmEmailChange = "auth-confirm-email-change";
    public const string ChangePassword = "auth-change-password";
}
