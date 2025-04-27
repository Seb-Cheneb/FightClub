namespace Data.Competitions;

public static class CompetitionMapper
{
    public static Competition CreateModel(this CompetitionCreateRequest instance)
    {
        return new Competition
        {
            Id = Guid.NewGuid().ToString(),
            Type = instance.Type,
            Name = instance.Name,
            Description = instance.Description,
        };
    }

    public static CompetitionDto CastToDto(this Competition instance)
    {
        return new CompetitionDto
        {
            Id = instance.Id,
            Type = instance.Type,
            Name = instance.Name,
            Description = instance.Description,
            BracketIds = instance.Brackets.Select(i => i.Id ?? "NULL").ToList(),
            FighterIds = instance.Fighters.Select(i => i.Id ?? "NULL").ToList(),
        };
    }

    public static void Update(this Competition instance, CompetitionDto request)
    {
        instance.Name = request.Name ?? instance.Name;
        instance.Type = request.Type ?? instance.Type;
        instance.Description = request.Description ?? instance.Description;
    }
}