using Data.Fighters;

namespace Data.DTOs;

public class ClubDto
{
    public string? Id { get; set; }
    public string? AppUserId { get; set; }
    public string? Name { get; set; }
    public List<FighterDto> Fighters { get; set; } = [];
}