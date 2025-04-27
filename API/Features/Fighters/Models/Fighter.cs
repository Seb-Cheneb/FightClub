using API.Features.Brackets.Models;
using API.Features.Clubs.Models;
using API.Features.Competitions.Models;

namespace API.Features.Fighters.Models;

public class Fighter
{
    public DateTime Birthdate { get; set; }
    public ICollection<Bracket> Brackets { get; set; } = [];
    public Club? Club { get; set; }
    public string? ClubId { get; set; }
    public ICollection<Competition> Competitions { get; set; } = [];
    public string? Gender { get; set; }
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Rank { get; set; }
    public float Weight { get; set; }
}