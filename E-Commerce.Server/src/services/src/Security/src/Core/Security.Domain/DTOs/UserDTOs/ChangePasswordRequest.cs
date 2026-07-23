namespace Security.Domain.DTOs.UserDTOs;

public sealed record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword,
    string ConfirmPassword);
