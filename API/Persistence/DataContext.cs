using Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Persistence;

public class DataContext : IdentityDbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<AppUser> AppUsers { get; set; }

    public DbSet<Competition> Competitions { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<Fighter> Fighters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<Competition>()
            .HasMany(left => left.Fighters)
            .WithMany(right => right.Competitions)
            .UsingEntity(join => join.ToTable("FighterCompetition"));

        //modelBuilder.Entity<CompetitionFighter>()
        //    .HasKey(joinEntity => new { joinEntity.CompetitionId, joinEntity.FighterId });

        //modelBuilder.Entity<CompetitionFighter>()
        //    .HasOne(i => i.Competition)
        //    .WithMany(i => i.FighterIds)
        //    .HasForeignKey(i => i.CompetitionId);

        //modelBuilder.Entity<Match>()
        //    .HasMany(e => e.FighterIds)
        //    .WithMany(e => e.MatchIds)
        //    .UsingEntity<MatchFighter>();

        //// many-to-many (fighter-match)
        //modelBuilder.Entity<FighterMatch>()
        //    .HasKey(joinEntity => new { joinEntity.FighterId, joinEntity.MatchId });

        //modelBuilder.Entity<FighterMatch>()
        //    .HasOne(joinEntity => joinEntity.Fighter)
        //    .WithMany(otherTable => otherTable.MatchIds)
        //    .HasForeignKey(joinEntity => joinEntity.FighterId);

        //modelBuilder.Entity<FighterMatch>()
        //    .HasOne(joinEntity => joinEntity.Match)
        //    .WithMany(otherTable => otherTable.FighterIds)
        //    .HasForeignKey(joinEntity => joinEntity.MatchId);

        // many to one (match - matches)
        modelBuilder.Entity<Match>()
            .HasOne(match => match.Competition)
            .WithMany(competition => competition.Matches)
            //.HasForeignKey(match => match.CompetitionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}