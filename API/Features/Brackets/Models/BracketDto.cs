using API.Features.Fighters.Models;

namespace API.Features.Brackets.Models;

public class BracketDto
{
    public string? Id { get; set; }
    public string? CompetitionId { get; set; }
    public string? Name { get; set; }
    public string? Surface { get; set; }
    public List<FighterDto> Fighters { get; set; } = [];
    public List<PositionDto> Positions { get; set; } = [];
}