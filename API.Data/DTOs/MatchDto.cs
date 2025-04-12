namespace Data.DTOs;

using Data.Enums;

public class MatchDto
{
    public string? Id { get; set; }
    public string? CompetitionId { get; set; }
    public string Winner { get; set; } = string.Empty;
    public MatchCategory Category { get; set; }
    public List<string> FighterIds { get; set; } = [];
}