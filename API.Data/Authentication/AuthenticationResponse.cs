namespace Data.Authentication;

public class AuthenticationResponse
{
    public DateTime ExpirationDate { get; set; }
    public required string JwtToken { get; set; }
    public required string RefreshToken { get; set; }
    public required string UserId { get; set; }
}