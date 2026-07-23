namespace E_Commerce.Server.Shared.EmailService.Options;

public sealed record EmailOptions(
    string Host,
    int Port,
    bool EnableSsl,
    string From,
    string Username,
    string AppPassword);
