using Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace Data.Users;

public class AppUser : IdentityUser
{
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiry { get; set; }

    public string? ClubId { get; set; }
    public Club? Club { get; set; }
}