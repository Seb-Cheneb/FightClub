namespace Data.Entities;

public class Match
{
    public string? Id { get; set; }
    public Competition? Competition { get; set; }
    public string? CompetitionId { get; set; }
    public string Winner { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Number { get; set; }
    public List<Fighter> Fighters { get; set; } = [];
}