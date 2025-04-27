namespace Data.Clubs;

public static class ClubMapper
{
    public static Club CreateModel(this ClubCreateRequest instance)
    {
        return new Club
        {
            Id = Guid.NewGuid().ToString(),
            Name = instance.ClubName,
        };
    }
}