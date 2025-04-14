namespace Data.DTOs;

public class MatchCreateRequest
{
    public string? CompetitionId { get; set; }
    public string Category { get; set; } = string.Empty;
}