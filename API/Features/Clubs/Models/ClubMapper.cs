using API.Features.Clubs.Models;
using API.Features.Fighters.Models;

namespace API.Features.Clubs.Models;

public static class ClubMapper
{
    public static ClubDto CastToDto(this Club instance)
    {
        return new ClubDto
        {
            Id = instance.Id,
            AppUserId = instance.AppUserId,
            Name = instance.Name,
            Fighters = instance.Fighters
                .Select(i => i.CastToDto())
                .ToList(),
        };
    }

    public static Club CreateModel(this ClubCreateRequest instance)
    {
        return new Club
        {
            Id = Guid.NewGuid().ToString(),
            AppUserId = instance.AppUserId,
            Name = instance.ClubName,
        };
    }

    public static void Update(this Club instance, ClubDto request)
    {
        instance.Name = request.Name;
    }
}