using API.Features.Fighters.Models;

namespace API.Features.Brackets;

public interface IBracketService
{
    public Task<bool> AddFighterToCompetition(string competitionId, Fighter fighter);

    public Task<bool> RemoveFighterFromCompetition(string competitionId, string fighterId);
}