using API.Persistence;
using API.Services.Interfaces;
using Data.Entities;
using Data.Enums;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class BracketService : IBracketService
{
    private readonly DataContext _dataContext;

    public BracketService(DataContext context)
    {
        _dataContext = context;
    }

    public async Task<bool> AddFighterToCompetition(string competitionId, Fighter fighter)
    {
        var competition = await _dataContext
            .Competitions
            .Include(i => i.Brackets)
            .Include(i => i.Fighters)
            .FirstOrDefaultAsync(i => i.Id == competitionId);

        var bracketName = GetFighterBracket(fighter);

        if (competition == null)
        {
            return false;
        }

        if (competition.Brackets.Select(i => i.Name).Contains(bracketName))
        {
            competition.Brackets.FirstOrDefault(i => i.Name == bracketName).Fighters.Add(fighter);
        }
        else
        {
            competition.Brackets.Add(new Bracket
            {
                Id = Guid.NewGuid().ToString(),
                CompetitionId = competitionId,
                Name = bracketName,
                Fighters = new List<Fighter> { fighter }
            });
        }

        await _dataContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveFighterFromCompetition(string competitionId, string fighterId)
    {
        var competition = await _dataContext
            .Competitions
            .Include(i => i.Brackets)
            .Include(i => i.Fighters)
            .FirstOrDefaultAsync(i => i.Id == competitionId);
        if (competition == null) return false;

        var fighter = competition.Fighters.FirstOrDefault(i => i.Id == fighterId);
        if (fighter == null) return false;

        competition.Brackets.FirstOrDefault(i => i.Fighters.Any(f => f.Id == fighterId))?.Fighters.Remove(fighter);

        return true;
    }

    private int GetFighterAge(Fighter fighter)
    {
        var today = DateTime.Today;
        var age = today.Year - fighter.Birthdate.Year;
        if (fighter.Birthdate.Date > today.AddYears(-age)) age--;
        return age;
    }

    private string GetFighterBracket(Fighter fighter)
    {
        int age = GetFighterAge(fighter);
        float weight = fighter.Weight;
        string gender = fighter.Gender ?? "NULL";

        if (age >= 45)
        {
            if (weight >= 80) return Categories.KumiteVeteraniPeste80;
            else return Categories.KumiteVeteraniSub80;
        }
        else if (age >= 18)
        {
            if (gender.Equals("masculin"))
            {
                if (weight >= 85) return Categories.KumiteSenioriMasculinPeste85;
                else if (weight >= 75) return Categories.KumiteSenioriMasculinSub85;
                else return Categories.KumiteSenioriMasculinSub75;
            }
            else
            {
                if (weight >= 65) return Categories.KumiteSenioriFemininPeste65;
                else if (weight >= 60) return Categories.KumiteSenioriFemininSub65;
                else return Categories.KumiteSenioriFemininSub60;
            }
        }
        else if (age >= 16)
        {
            if (gender.Equals("masculin"))
            {
                if (weight >= 75) return Categories.KumiteJunioriBaietiPeste75;
                else if (weight >= 70) return Categories.KumiteJunioriBaietiSub75;
                else if (weight >= 65) return Categories.KumiteJunioriBaietiSub70;
                else return Categories.KumiteJunioriBaietiSub65;
            }
            else
            {
                if (weight >= 65) return Categories.KumiteJunioriFetePeste65;
                else if (weight >= 60) return Categories.KumiteJunioriFeteSub65;
                else if (weight >= 55) return Categories.KumiteJunioriFeteSub60;
                else return Categories.KumiteJunioriFeteSub55;
            }
        }

        return "UNIMPLEMENTED";
    }
}