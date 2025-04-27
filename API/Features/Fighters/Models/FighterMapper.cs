namespace API.Features.Fighters.Models;

public static class FighterMapper
{
    public static FighterDto CastToDto(this Fighter instance)
    {
        return new FighterDto
        {
            Id = instance.Id,
            Name = instance.Name,
            Gender = instance.Gender,
            Birthdate = instance.Birthdate,
            Weight = instance.Weight,
            Club = instance.Club.Name,
            Rank = instance.Rank,
            CompetitionIds = instance.Competitions.Select(i => i.Id ?? "NULL").ToList(),
        };
    }

    public static Fighter CreateModel(this FighterCreateRequest instance)
    {
        return new Fighter
        {
            Id = Guid.NewGuid().ToString(),
            Name = instance.Name,
            Gender = instance.Gender,
            Birthdate = instance.Birthdate,
            Weight = instance.Weight,
            ClubId = instance.ClubId,
            Rank = instance.Rank,
        };
    }

    public static void Update(this Fighter instance, FighterDto request)
    {
        instance.Name = request.Name ?? instance.Name;
        instance.Gender = request.Gender ?? instance.Gender;
        //instance.Club = request.Club ?? instance.Club;
        instance.Rank = request.Rank ?? instance.Rank;
    }
}