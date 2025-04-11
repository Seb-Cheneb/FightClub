namespace Data.Entities;

public class Fighter
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Gender { get; set; }
    public DateTime Birthdate { get; set; }
    public float Weight { get; set; }
    public string? Club { get; set; }
    public string? Rank { get; set; }

    public ICollection<Competition> Competitions { get; set; } = [];
    public ICollection<Match> Matches { get; set; } = [];
}