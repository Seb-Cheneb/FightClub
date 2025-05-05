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
        string rank = fighter.Rank ?? "no kyu";

        string incepatoriGrupaUnu = ", begginers first group";
        string incepatoriGrupaDoi = ", begginers second group";
        // LASATA IN CAZUL IN CARE VREI TREI GRUPE
        //string incepatoriGrupaTrei = ", begginers third group";
        string avansati = ", advanced";

        if (bracketType.ToLower().Equals("kumite"))
        {
            if (age < 6)
            {
                if (weight >= 24)
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt6AniPeste24);
                }
                else if (weight >= 20)
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt6AniSub24);
                }
                else
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt6AniSub20);
                }
            }
            else if (age < 7)
            {
                if (weight >= 30)
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt7AniPeste30);
                }
                else if (weight >= 25)
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt7AniSub30);
                }
                else if (weight >= 20)
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt7AniSub25);
                }
                else
                {
                    return GetBracketBasedOnExperience(rank, Categories.KumiteMixt7AniSub20);
                }
            }
            else if (age < 8)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti8AniPeste35);
                    }
                    else if (weight >= 30)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti8AniSub35);
                    }
                    else if (weight >= 25)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti8AniSub30);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti8AniSub25);
                    }
                }
                else
                {
                    if (weight >= 30)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete8AniPeste30);
                    }
                    else if (weight >= 25)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete8AniSub30);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete8AniSub25);
                    }
                }
            }
            else if (age < 9)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti9AniPeste40);
                    }
                    else if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti9AniSub40);
                    }
                    else if (weight >= 30)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti9AniSub35);
                    }
                    else if (weight >= 25)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti9AniSub30);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti9AniSub25);
                    }
                }
                else
                {
                    if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete9AniPeste35);
                    }
                    else if (weight >= 30)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete9AniSub35);
                    }
                    else if (weight >= 25)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete9AniSub30);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete9AniSub25);
                    }
                }
            }
            else if (age < 10)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 45)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti10AniPeste45);
                    }
                    else if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti10AniSub45);
                    }
                    else if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti10AniSub40);
                    }
                    else if (weight >= 30)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti10AniSub35);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti10AniSub30);
                    }
                }
                else
                {
                    if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete10AniPeste40);
                    }
                    else if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete10AniSub40);
                    }
                    else if (weight >= 30)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete10AniSub35);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete10AniSub30);
                    }
                }
            }
            else if (age < 12)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 50)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti11AniPeste50);
                    }
                    else if (weight >= 45)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti11AniSub50);
                    }
                    else if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti11AniSub45);
                    }
                    else if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti11AniSub40);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti11AniSub35);
                    }
                }
                else
                {
                    if (weight >= 45)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete11AniPeste45);
                    }
                    else if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete11AniSub45);
                    }
                    else if (weight >= 35)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete11AniSub40);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete11AniSub35);
                    }
                }
            }
            else if (age < 14)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 60)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti13AniPeste60);
                    }
                    else if (weight >= 55)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti13AniSub60);
                    }
                    else if (weight >= 50)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti13AniSub55);
                    }
                    else if (weight >= 45)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti13AniSub50);
                    }
                    else if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti13AniSub45);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiBaieti13AniSub40);
                    }
                }
                else
                {
                    if (weight >= 55)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete13AniPeste55);
                    }
                    else if (weight >= 50)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete13AniSub55);
                    }
                    else if (weight >= 45)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete13AniSub50);
                    }
                    else if (weight >= 40)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete13AniSub45);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCopiiFete13AniSub40);
                    }
                }
            }
            else if (age < 16)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 65)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiBaietiPeste65);
                    }
                    else if (weight >= 60)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiBaietiSub65);
                    }
                    else if (weight >= 55)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiBaietiSub60);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiBaietiSub55);
                    }
                }
                else
                {
                    if (weight >= 60)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiFetePeste60);
                    }
                    else if (weight >= 55)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiFeteSub60);
                    }
                    else if (weight >= 50)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiFeteSub55);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteCadetiFeteSub50);
                    }
                }
            }
            else if (age < 18)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 75)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriBaietiPeste75);
                    }
                    else if (weight >= 70)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriBaietiSub75);
                    }
                    else if (weight >= 65)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriBaietiSub70);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriBaietiSub65);
                    }
                }
                else
                {
                    if (weight >= 65)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriFetePeste65);
                    }
                    else if (weight >= 60)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriFeteSub65);
                    }
                    else if (weight >= 55)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriFeteSub60);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteJunioriFeteSub55);
                    }
                }
            }
            else if (age < 45)
            {
                if (gender.Equals("masculin"))
                {
                    if (weight >= 85)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteSenioriMasculinPeste85);
                    }
                    else if (weight >= 75)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteSenioriMasculinSub85);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteSenioriMasculinSub75);
                    }
                }
                else
                {
                    if (weight >= 65)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteSenioriFemininPeste65);
                    }
                    else if (weight >= 60)
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteSenioriFemininSub65);
                    }
                    else
                    {
                        return GetBracketBasedOnExperience(rank, Categories.KumiteSenioriFemininSub60);
                    }
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
                if (rank.Equals("no kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                    return Categories.KataMixt_7_8ani_Individual_0_10_9kyu;
                else
                    return Categories.KataMixt_7_8ani_Individual_8_7_6_sup_kyu;
            }
            else if (age >= 9 && age <= 10)
            {
                if (rank.Equals("no kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                    return Categories.KataMixt_9_10ani_Individual_0_10_9kyu;
                else if (rank.Equals("8 kyu") || rank.Equals("7 kyu") || rank.Equals("6 kyu"))
                    return Categories.KataMixt_9_10ani_Individual_8_7_6_sup_kyu;

                if (gender.Equals("masculin"))
                    return Categories.KataBaieti_9_10ani_5_4_3_2_sup_kyu;
                else
                    return Categories.KataFete_9_10ani_5_4_3_2_sup_kyu;
            }
            else if (age >= 11 && age <= 12)
            {
                if (rank.Equals("no kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_11_12ani_0_10_9kyu;
                    else
                        return Categories.KataFete_11_12ani_0_10_9kyu;
                }
                else if (rank.Equals("8 kyu") || rank.Equals("7 kyu") || rank.Equals("6 kyu"))
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_11_12ani_8_7_6kyu;
                    else
                        return Categories.KataFete_11_12ani_8_7_6kyu;
                }
                else
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_11_12ani_5_4_3_2_sup_kyu;
                    else
                        return Categories.KataFete_11_12ani_5_4_3_2_sup_kyu;
                }
            }
            else if (age >= 13 && age <= 15)
            {
                if (rank.Equals("no kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_13_15ani_0_10_9kyu;
                    else
                        return Categories.KataFete_13_15ani_0_10_9kyu;
                }
                else if (rank.Equals("8 kyu") || rank.Equals("7 kyu") || rank.Equals("6 kyu") || rank.Equals("5 kyu"))
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_13_15ani_8_7_6_5kyu;
                    else
                        return Categories.KataFete_13_15ani_8_7_6_5kyu;
                }
                else
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_13_15ani_4_3_2_1kyu;
                    else
                        return Categories.KataFete_13_15ani_4_3_2_1kyu;
                }
            }
            else
            {
                if (rank.Equals("no kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_Peste15Ani_0_10_9kyu;
                    else
                        return Categories.KataFete_Peste15Ani_0_10_9kyu;
                }
                else if (rank.Equals("8 kyu") || rank.Equals("7 kyu") || rank.Equals("6 kyu") || rank.Equals("5 kyu"))
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataBaieti_Peste15Ani_8_7_6_5kyu;
                    else
                        return Categories.KataFete_Peste15Ani_8_7_6_5kyu;
                }
                else
                {
                    if (gender.Equals("masculin"))
                        return Categories.KataMasculin_Peste16Ani_4_3_2_1_sup_kyu;
                    else
                        return Categories.KataFeminin_Peste16Ani_4_3_2_1_sup_kyu;
                }
            }
        }
    }

    private int GetFighterAge(Fighter fighter)
    {
        var today = DateTime.Today;
        var age = today.Year - fighter.Birthdate.Year;
        if (fighter.Birthdate.Date > today.AddYears(-age)) age--;
        return age;
    }

    private string GetBracketBasedOnExperience(string rank, string group)
    {
        string incepatoriGrupaUnu = ", begginers first group";
        string incepatoriGrupaDoi = ", begginers second group";
        // LASATA IN CAZUL IN CARE VREI TREI GRUPE
        //string incepatoriGrupaTrei = ", begginers third group";
        string avansati = ", advanced";

        if (rank.Equals("no kyu") || rank.Equals("10 kyu") || rank.Equals("9 kyu"))
            return group + incepatoriGrupaUnu;
        else if (rank.Equals("8 kyu") || rank.Equals("7 kyu") || rank.Equals("6 kyu"))
            return group + incepatoriGrupaDoi;
        //else if (rank.Equals("5 kyu") || rank.Equals("4 kyu"))
        //    return group + incepatoriGrupaDoi;
        else
            return group + avansati;
    }
}