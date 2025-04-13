namespace Data.DTOs;

public class MatchDto
{
    public string? Id { get; set; }
    public string? CompetitionId { get; set; }
    public string Winner { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Number { get; set; }
    public List<string> FighterIds { get; set; } = [];
}