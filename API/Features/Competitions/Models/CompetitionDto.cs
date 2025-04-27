namespace API.Features.Competitions.Models;

public class CompetitionDto
{
    public string? Id { get; set; }
    public string? Type { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public List<string> FighterIds { get; set; } = [];
    public List<string> BracketIds { get; set; } = [];
}