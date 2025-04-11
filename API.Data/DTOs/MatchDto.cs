namespace Data.DTOs;

public class MatchDto
{
    public string? Id { get; set; }
    public string? CompetitionId { get; set; }
    public string Winner { get; set; } = string.Empty;

    public List<string> FighterIds { get; set; } = [];
}