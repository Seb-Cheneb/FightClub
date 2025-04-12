namespace Data.DTOs;

using Data.Enums;

public class CreateMatchDto
{
    public string? CompetitionId { get; set; }
    public MatchCategory Category { get; set; }
}