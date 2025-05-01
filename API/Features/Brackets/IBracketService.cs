using API.Features.Fighters.Models;

namespace API.Features.Brackets;

public interface IBracketService
{
    public Task<bool> EnrollFighter(string competitionId, Fighter fighter, string bracketType);

    public Task<bool> UnEnrollFighter(string competitionId, string fighterId, string bracketType);

    public Task<bool> RemoveFighterFromCompetition(string competitionId, string fighterId);
}