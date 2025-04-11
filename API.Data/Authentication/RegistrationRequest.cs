namespace Data.Authentication;

public class RegistrationRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Username { get; set; }
}