namespace Data.Positions;

public static class PositionMapper
{
    public static PositionDto CastToDto(this Position instance)
    {
        return new PositionDto
        {
            Key = instance.Key,
            Value = instance.Value
        };
    }
}