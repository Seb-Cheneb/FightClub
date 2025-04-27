using API.Features.Clubs.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Users.Models;

public class AppUser : IdentityUser
{
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiry { get; set; }

    public Club? Club { get; set; }
}