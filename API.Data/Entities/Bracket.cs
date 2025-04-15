namespace Data.Entities;

public class Bracket
{
    public string? Id { get; set; }
    public Competition? Competition { get; set; }
    public string? CompetitionId { get; set; }
    public string? Name { get; set; }
    public List<Fighter> Fighters { get; set; } = [];
}