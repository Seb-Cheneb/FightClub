using Data.DTOs;
using Data.Entities;

namespace Data.Mappers;

public static class MatchMapper
{
    public static Match CreateModel(string competitionId)
    {
        return new Match
        {
            Id = Guid.NewGuid().ToString(),
            CompetitionId = competitionId
        };
    }

    public static MatchDto CastToDto(this Match instance)
    {
        return new MatchDto
        {
            Id = instance.Id,
            CompetitionId = instance.CompetitionId,
            Winner = instance.Winner,
            FighterIds = instance.Fighters.Select(fighter => fighter.Id ?? "NULL").ToList(),
        };
    }

    public static void Update(this Match instance, MatchDto request)
    {
        instance.Winner = request.Winner ?? instance.Winner;
    }
}