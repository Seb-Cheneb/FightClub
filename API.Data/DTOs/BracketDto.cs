namespace Data.DTOs;

public class BracketDto
{
    public string? Id { get; set; }
    public string? CompetitionId { get; set; }
    public string? Category { get; set; }
    public List<string> FighterIds { get; set; } = [];
}