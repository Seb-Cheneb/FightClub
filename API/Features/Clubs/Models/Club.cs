using API.Features.Fighters.Models;
using API.Users.Models;

namespace API.Features.Clubs.Models;

public class Club
{
    public string? Id { get; set; }
    public string? Name { get; set; }

    public string? AppUserId { get; set; }
    public AppUser? AppUser { get; set; }

    public ICollection<Fighter> Fighters { get; set; } = [];
}