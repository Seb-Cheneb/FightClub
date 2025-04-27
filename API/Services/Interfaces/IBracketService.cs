using Data.Fighters;

namespace API.Services.Interfaces;

public interface IBracketService
{
    public Task<bool> AddFighterToCompetition(string competitionId, Fighter fighter);

    public Task<bool> RemoveFighterFromCompetition(string competitionId, string fighterId);
}