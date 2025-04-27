using Data.Fighters;
using Data.Users;

namespace Data.Entities;

public class Club
{
    public string? Id { get; set; }
    public string? Name { get; set; }

    public string? AppUserId { get; set; }
    public AppUser? User { get; set; }

    public ICollection<Fighter> Fighters { get; set; } = [];
}