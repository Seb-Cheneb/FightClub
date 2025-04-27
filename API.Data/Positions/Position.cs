using Data.Brackets;

namespace Data.Positions;

public class Position
{
    public string Id { get; set; }
    public Bracket Bracket { get; set; }
    public string BracketId { get; set; }
    public int Key { get; set; }
    public string Value { get; set; } = string.Empty;
}