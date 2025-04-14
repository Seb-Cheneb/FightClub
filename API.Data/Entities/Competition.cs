namespace Data.Entities;

public class Competition
{
    public string? Id { get; set; }
    public string? Type { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }

    public ICollection<Match> Matches { get; set; } = [];
    public ICollection<Bracket> Brackets { get; set; } = [];
    public ICollection<Fighter> Fighters { get; set; } = [];
}