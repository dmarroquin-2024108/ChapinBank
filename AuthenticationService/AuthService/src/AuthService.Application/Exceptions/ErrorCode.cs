namespace AuthService.Application.Exceptions;

public static class ErrorCodes
{
    public const string EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public const string USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS";
    public const string INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public const string UNAUTHORIZED_ROLE_ASSIGNMENT = "UNAUTHORIZED_ROLE_ASSIGNMENT";
}
