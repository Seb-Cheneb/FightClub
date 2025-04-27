using Data.Brackets;
using Data.Fighters;
using Data.Positions;

namespace Data.Brackets;

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
            Fighters = instance.Fighters.Select(i => i.CastToDto()).ToList(),
            Positions = instance.Positions.Select(i => i.CastToDto()).ToList()
        };
    }

    public static void Update(this Bracket instance, BracketDto request)
    {
        instance.Name = request.Name;
    }
}