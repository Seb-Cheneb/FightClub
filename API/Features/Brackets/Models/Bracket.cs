using API.Features.Competitions.Models;
using API.Features.Fighters.Models;

namespace API.Features.Brackets.Models;

public class Bracket
{
    public string? Id { get; set; }
    public Competition? Competition { get; set; }
    public string? CompetitionId { get; set; }
    public string? Name { get; set; }
    public string? Surface { get; set; }

    public ICollection<Fighter> Fighters { get; set; } = [];
    public ICollection<Position> Positions { get; set; } = [];
}