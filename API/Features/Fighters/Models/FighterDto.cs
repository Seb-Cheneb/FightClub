namespace API.Features.Fighters.Models;

public class FighterDto
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Gender { get; set; }
    public DateTime Birthdate { get; set; }
    public float Weight { get; set; }
    public string? Club { get; set; }
    public string? Rank { get; set; }
    //public List<string> CompetitionIds { get; set; } = [];
    //public List<string> BracketIds { get; set; } = [];
}