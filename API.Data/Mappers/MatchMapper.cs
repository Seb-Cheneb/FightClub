using Data.DTOs;
using Data.Entities;

namespace Data.Mappers;

public static class MatchMapper
{
    public static Match CreateModel(CreateMatchDto request)
    {
        return new Match
        {
            Id = Guid.NewGuid().ToString(),
            CompetitionId = request.CompetitionId,
            Category = request.Category
        };
    }

    public static MatchDto CastToDto(this Match instance)
    {
        return new MatchDto
        {
            Id = instance.Id,
            CompetitionId = instance.CompetitionId,
            Winner = instance.Winner,
            Category = instance.Category,
            Number = instance.Number,
            FighterIds = instance.Fighters.Select(fighter => fighter.Id ?? "NULL").ToList(),
        };
    }

    public static void Update(this Match instance, MatchDto request)
    {
        instance.Winner = request.Winner ?? instance.Winner;
        instance.Category = request.Category;
        instance.Number = request.Number;
    }
}