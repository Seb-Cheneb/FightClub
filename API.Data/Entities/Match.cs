namespace Data.Entities;

using Data.Enums;

public class Match
{
    public string? Id { get; set; }
    public string Winner { get; set; } = string.Empty;
    public string? CompetitionId { get; set; }
    public MatchCategory Category { get; set; }
    public Competition? Competition { get; set; }
    public List<Fighter> Fighters { get; set; } = [];
}