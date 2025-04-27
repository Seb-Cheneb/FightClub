namespace API.Features.Brackets.Models;

public class BracketCreateRequest
{
    public string CompetitionId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}