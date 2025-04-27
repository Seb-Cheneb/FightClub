using API.Features.Fighters.Models;

namespace API.Features.Clubs.Models;

public class ClubDto
{
    public string? Id { get; set; }
    public string? AppUserId { get; set; }
    public string? Name { get; set; }
    public List<FighterDto> Fighters { get; set; } = [];
}