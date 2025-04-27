using Data.Fighters;
using Data.Positions;

namespace Data.Brackets;

public class BracketDto
{
    public string? Id { get; set; }
    public string? CompetitionId { get; set; }
    public string? Name { get; set; }
    public List<FighterDto> Fighters { get; set; } = [];
    public List<PositionDto> Positions { get; set; } = [];
}