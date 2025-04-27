namespace Data.Fighters;

public class FighterCreateRequest
{
    public string? Name { get; set; }
    public string? Gender { get; set; }
    public DateTime Birthdate { get; set; }
    public float Weight { get; set; }
    public string? Club { get; set; }
    public string? Rank { get; set; }
}