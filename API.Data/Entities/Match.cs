using Data.Enum;

namespace Data.Entities;

public class Match
{
    public string? Id { get; set; }
    public string Winner { get; set; } = string.Empty;

    public string? CompetitionId { get; set; }
    public Competition? Competition { get; set; }

    public List<Fighter> Fighters { get; set; } = [];
}