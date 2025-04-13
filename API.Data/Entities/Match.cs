namespace Data.Entities;

using Data.Enums;

public class Match
{
    public string? Id { get; set; }
    public string Winner { get; set; } = string.Empty;
    public string? CompetitionId { get; set; }
    public string Category { get; set; } = string.Empty;
    public Competition? Competition { get; set; }
    public List<Fighter> Fighters { get; set; } = [];
}