using API.Persistence;
using API.Services.Interfaces;
using Data.Entities;

namespace API.Services;

public class BracketService : IBracketService
{
    private readonly DataContext _dataContext;

    public BracketService(DataContext context)
    {
        _dataContext = context;
    }

    public string GetFighterBracket(Fighter fighter)
    {
        int age = GetFighterAge(fighter);
        float weight = fighter.Weight;
        string gender = fighter.Gender ?? "NULL";

        if (age >= 45)
        {
            if (weight >= 80) return "Kumite veterani +80 kg";
            else return "Kumite veterani -80 kg";
        }
        else if (age >= 18)
        {
            if (gender.Equals("masculin"))
            {
                if (weight >= 85) return "Kumite seniori masculin +85 kg";
                else if (weight >= 75) return "Kumite seniori masculin -85 kg";
                else return "Kumite seniori masculin -75 kg";
            }
            else
            {
                if (weight >= 65) return "Kumite seniori feminin +65 kg";
                else if (weight >= 60) return "Kumite seniori feminin -65 kg";
                else return "Kumite seniori feminin -60 kg";
            }
        }
        else if (age >= 16)
        {
            if (gender.Equals("masculin"))
            {
                if (weight >= 75) return "Kumite juniori baieti +75 kg";
                else if (weight >= 70) return "Kumite juniori baieti -75 kg";
                else if (weight >= 65) return "Kumite juniori baieti -70 kg";
                else return "Kumite juniori baieti -65 kg";
            }
            else
            {
                if (weight >= 65) return "Kumite seniori feminin +65 kg";
                else if (weight >= 60) return "Kumite seniori feminin -65 kg";
                else return "Kumite seniori feminin -60 kg";
            }
        }

        return "";
    }

    public async Task<bool> AddNewFighterToCompetition(string competitionId, Fighter fighter)
    {
        var competition = await _dataContext.Competitions.FindAsync(competitionId);
        //if (competition.Brackets.Contains)
        return true;
    }

    private int GetFighterAge(Fighter fighter)
    {
        var today = DateTime.Today;
        var age = today.Year - fighter.Birthdate.Year;
        if (fighter.Birthdate.Date > today.AddYears(-age)) age--;
        return age;
    }
}