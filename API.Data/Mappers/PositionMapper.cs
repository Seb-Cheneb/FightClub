using Data.DTOs;
using Data.Entities;

namespace Data.Mappers;

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