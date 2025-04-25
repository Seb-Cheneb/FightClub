namespace Data.Entities;

public class Bracket
{
    public string? Id { get; set; }
    public Competition? Competition { get; set; }
    public string? CompetitionId { get; set; }
    public string? Name { get; set; }

    public ICollection<Fighter> Fighters { get; set; } = [];
    public ICollection<Position> Positions { get; set; } = [];
}