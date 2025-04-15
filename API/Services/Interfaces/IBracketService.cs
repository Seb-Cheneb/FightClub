using Data.Entities;

namespace API.Services.Interfaces;

public interface IBracketService
{
    public Task<bool> AddNewFighterToCompetition(string competitionId, Fighter fighter);
}