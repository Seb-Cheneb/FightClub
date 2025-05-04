using API.Features.Brackets.Models;
using API.Features.Fighters.Models;
using API.Persistence;
using Azure;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Brackets;

public class BracketService : IBracketService
{
    private readonly DataContext _dataContext;

    public BracketService(DataContext context)
    {
        _dataContext = context;
    }

    public async Task<bool> EnrollFighter(string competitionId, Fighter fighter, string bracketType)
    {
        var competition = await _dataContext
            .Competitions
            .Include(i => i.Brackets)
            .Include(i => i.Fighters)
            .FirstOrDefaultAsync(i => i.Id == competitionId);

        if (competition == null)
        {
            return false;
        }

        var bracketName = GetBracket(fighter, bracketType);

        // first check if the bracket already exists
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

    public async Task<bool> UnEnrollFighter(string competitionId, string fighterId, string bracketType)
    {
        var competition = await _dataContext.Competitions
            .Include(i => i.Brackets)
                .ThenInclude(b => b.Fighters)
            .Include(i => i.Fighters)
            .FirstOrDefaultAsync(i => i.Id == competitionId);

        if (competition == null)
        {
            return false;
        }

        var fighter = competition.Fighters.FirstOrDefault(i => i.Id == fighterId);

        if (fighter == null)
        {
            return false;
        }

        foreach (var bracket in competition.Brackets)
        {
            if (bracket.Name != null && bracket.Name.StartsWith(bracketType, StringComparison.OrdinalIgnoreCase))
            {
                if (bracket.Fighters.Any(f => f.Id == fighterId))
                {
                    bracket.Fighters.Remove(fighter);
                }
            }
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

    private string GetBracket(Fighter fighter, string bracketType)
    {
        int age = GetFighterAge(fighter);
        float weight = fighter.Weight;
        string gender = fighter.Gender ?? "NULL";
        string rank = fighter.Rank ?? "10 kyu";

        if (bracketType.ToLower().Equals("kumite"))
        {
            if (age < 6)
            {
                if (weight >= 24) return Categories.KumiteMixt6AniPeste24;
                else if (weight >= 20) return Categories.KumiteMixt6AniSub24;
                else return Categories.KumiteMixt6AniSub20;
            }
            else if (age < 7)
            {
                if (weight >= 30) return Categories.KumiteMixt7AniPeste30;
                else if (weight >= 25) return Categories.KumiteMixt7AniSub30;
                else if (weight >= 20) return Categories.KumiteMixt7AniSub25;
                else return Categories.KumiteMixt7AniSub20;
            }
            else if (age < 8)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 35) return Categories.KumiteCopiiBaieti8AniPeste35;
                    else if (weight >= 30) return Categories.KumiteCopiiBaieti8AniSub35;
                    else if (weight >= 25) return Categories.KumiteCopiiBaieti8AniSub30;
                    else return Categories.KumiteCopiiBaieti8AniSub25;
                }
                else
                {
                    if (weight >= 30) return Categories.KumiteCopiiFete8AniPeste30;
                    else if (weight >= 25) return Categories.KumiteCopiiFete8AniSub30;
                    else return Categories.KumiteCopiiFete8AniSub25;
                }
            }
            else if (age < 9)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 40) return Categories.KumiteCopiiBaieti9AniPeste40;
                    else if (weight >= 35) return Categories.KumiteCopiiBaieti9AniSub40;
                    else if (weight >= 30) return Categories.KumiteCopiiBaieti9AniSub35;
                    else if (weight >= 25) return Categories.KumiteCopiiBaieti9AniSub30;
                    else return Categories.KumiteCopiiBaieti9AniSub25;
                }
                else
                {
                    if (weight >= 35) return Categories.KumiteCopiiFete9AniPeste35;
                    else if (weight >= 30) return Categories.KumiteCopiiFete9AniSub35;
                    else if (weight >= 25) return Categories.KumiteCopiiFete9AniSub30;
                    else return Categories.KumiteCopiiFete9AniSub25;
                }
            }
            else if (age < 10)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 45) return Categories.KumiteCopiiBaieti10AniPeste45;
                    else if (weight >= 40) return Categories.KumiteCopiiBaieti10AniSub45;
                    else if (weight >= 35) return Categories.KumiteCopiiBaieti10AniSub40;
                    else if (weight >= 30) return Categories.KumiteCopiiBaieti10AniSub35;
                    else return Categories.KumiteCopiiBaieti10AniSub30;
                }
                else
                {
                    if (weight >= 40) return Categories.KumiteCopiiFete10AniPeste40;
                    else if (weight >= 35) return Categories.KumiteCopiiFete10AniSub40;
                    else if (weight >= 30) return Categories.KumiteCopiiFete10AniSub35;
                    else return Categories.KumiteCopiiFete10AniSub30;
                }
            }
            else if (age < 12)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 50) return Categories.KumiteCopiiBaieti11AniPeste50;
                    else if (weight >= 45) return Categories.KumiteCopiiBaieti11AniSub50;
                    else if (weight >= 40) return Categories.KumiteCopiiBaieti11AniSub45;
                    else if (weight >= 35) return Categories.KumiteCopiiBaieti11AniSub40;
                    else return Categories.KumiteCopiiBaieti11AniSub35;
                }
                else
                {
                    if (weight >= 45) return Categories.KumiteCopiiFete11AniPeste45;
                    else if (weight >= 40) return Categories.KumiteCopiiFete11AniSub45;
                    else if (weight >= 35) return Categories.KumiteCopiiFete11AniSub40;
                    else return Categories.KumiteCopiiFete11AniSub35;
                }
            }
            else if (age < 14)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 60) return Categories.KumiteCopiiBaieti13AniPeste60;
                    else if (weight >= 55) return Categories.KumiteCopiiBaieti13AniSub60;
                    else if (weight >= 50) return Categories.KumiteCopiiBaieti13AniSub55;
                    else if (weight >= 45) return Categories.KumiteCopiiBaieti13AniSub50;
                    else if (weight >= 40) return Categories.KumiteCopiiBaieti13AniSub45;
                    else return Categories.KumiteCopiiBaieti13AniSub40;
                }
                else
                {
                    if (weight >= 55) return Categories.KumiteCopiiFete13AniPeste55;
                    else if (weight >= 50) return Categories.KumiteCopiiFete13AniSub55;
                    else if (weight >= 45) return Categories.KumiteCopiiFete13AniSub50;
                    else if (weight >= 40) return Categories.KumiteCopiiFete13AniSub45;
                    else return Categories.KumiteCopiiFete13AniSub40;
                }
            }
            else if (age < 16)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 65) return Categories.KumiteCadetiBaietiPeste65;
                    else if (weight >= 60) return Categories.KumiteCadetiBaietiSub65;
                    else if (weight >= 55) return Categories.KumiteCadetiBaietiSub60;
                    else return Categories.KumiteCadetiBaietiSub55;
                }
                else
                {
                    if (weight >= 60) return Categories.KumiteCadetiFetePeste60;
                    else if (weight >= 55) return Categories.KumiteCadetiFeteSub60;
                    else if (weight >= 50) return Categories.KumiteCadetiFeteSub55;
                    else return Categories.KumiteCadetiFeteSub50;
                }
            }
            else if (age < 18)
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
            else if (age < 45)
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
            else
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 80) return Categories.KumiteVeteraniMasculinPeste80;
                    else return Categories.KumiteVeteraniMasculinSub80;
                }
                else
                {
                    if (weight >= 65) return Categories.KumiteVeteraniFemininPeste65;
                    else if (weight >= 60) return Categories.KumiteVeteraniFemininSub65;
                    else return Categories.KumiteVeteraniFemininSub60;
                }
            }
        }
        else
        {
            if (age < 7) return Categories.KataMixt_Sub7Ani_Individual;
            else if (age >= 7 && age <= 8)
            {
                if (rank.Equals("0 kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                    return Categories.KataMixt_7_8ani_Individual_0_10_9kyu;
                else
                    return Categories.KataMixt_7_8ani_Individual_8_7_6_sup_kyu;
            }
            else if (age >= 9 && age <= 10)
            {
                if (rank.Equals("0 kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                    return Categories.KataMixt_9_10ani_Individual_0_10_9kyu;
                else if (rank.Equals("8 kyu") || rank.Equals("7 kyu") || rank.Equals("6 kyu"))
                    return Categories.KataMixt_9_10ani_Individual_8_7_6_sup_kyu;

                if (gender.Equals("masculin"))
                    return Categories.KataBaieti_9_10ani_5_4_3_2_sup_kyu;
                else
                    return Categories.KataFete_9_10ani_5_4_3_2_sup_kyu;
            }
            return "Kata";
        }
    }

    private int GetFighterAge(Fighter fighter)
    {
        var today = DateTime.Today;
        var age = today.Year - fighter.Birthdate.Year;
        if (fighter.Birthdate.Date > today.AddYears(-age)) age--;
        return age;
    }
}