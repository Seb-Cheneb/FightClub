namespace API.Authentication.Models;

public class AuthenticationResponse
{
    public DateTime ExpirationDate { get; set; }
    public required string JwtToken { get; set; }
    public required string RefreshToken { get; set; }
    public required string UserId { get; set; }
    public required string Role { get; set; } = string.Empty;
}