using Data.Fighters;

namespace Data.Clubs;

public static class ClubMapper
{
    public static Club CreateModel(this ClubCreateRequest instance)
    {
        return new Club
        {
            Id = Guid.NewGuid().ToString(),
            AppUserId = instance.AppUserId,
            Name = instance.ClubName,
        };
    }

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

    public static void Update(this Club instance, ClubDto request)
    {
        instance.Name = request.Name;
    }
}