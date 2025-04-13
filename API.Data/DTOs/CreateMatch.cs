namespace Data.DTOs;

public class CreateMatchDto
{
    public string? CompetitionId { get; set; }
    public string Category { get; set; } = string.Empty;
}