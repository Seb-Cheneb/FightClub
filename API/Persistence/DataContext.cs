using Data.Brackets;
using Data.Competitions;
using Data.Fighters;
using Data.Positions;
using Data.Users;
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
    public DbSet<Bracket> Brackets { get; set; }
    public DbSet<Fighter> Fighters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<Competition>()
            .HasMany(competition => competition.Fighters)
            .WithMany(fighter => fighter.Competitions)
            .UsingEntity(join => join.ToTable("FighterCompetition"));

        modelBuilder
            .Entity<Bracket>()
            .HasMany(bracket => bracket.Fighters)
            .WithMany(fighter => fighter.Brackets)
            .UsingEntity(join => join.ToTable("Fighterompetition"));

        modelBuilder.Entity<Bracket>()
            .HasOne(bracket => bracket.Competition)
            .WithMany(competition => competition.Brackets)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Position>()
            .HasOne(position => position.Bracket)
            .WithMany(bracket => bracket.Positions)
            .OnDelete(DeleteBehavior.Cascade);
    }
}