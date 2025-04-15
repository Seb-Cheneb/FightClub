using Data.DTOs;
using Data.Entities;

namespace Data.Mappers;

public static class BracketMapper
{
    public static Bracket CreateModel(BracketCreateRequest request)
    {
        return new Bracket
        {
            Id = Guid.NewGuid().ToString(),
            CompetitionId = request.CompetitionId,
            Name = request.Name
        };
    }

    public static BracketDto CastToDto(this Bracket instance)
    {
        return new BracketDto
        {
            Id = instance.Id,
            CompetitionId = instance.CompetitionId,
            Name = instance.Name,
            FighterIds = instance.Fighters.Select(fighter => fighter.Id ?? "NULL").ToList(),
        };
    }

    public static void Update(this Bracket instance, BracketDto request)
    {
        instance.Name = request.Name;
    }
}