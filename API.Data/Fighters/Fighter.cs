using Data.Brackets;
using Data.Competitions;
using Data.Entities;
using Data.Users;

namespace Data.Fighters;

public class Fighter
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Gender { get; set; }
    public DateTime Birthdate { get; set; }
    public float Weight { get; set; }
    public string? Rank { get; set; }

    public ICollection<Competition> Competitions { get; set; } = [];
    public ICollection<Bracket> Brackets { get; set; } = [];

    public string? ClubId { get; set; }
    public Club? Club { get; set; }
}