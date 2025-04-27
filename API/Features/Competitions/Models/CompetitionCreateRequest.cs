namespace API.Features.Competitions.Models;

public class CompetitionCreateRequest
{
    public string? Type { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}