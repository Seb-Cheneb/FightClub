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

        // many to one (match - matches)
        modelBuilder.Entity<Match>()
            .HasOne(match => match.Competition)
            .WithMany(competition => competition.Matches)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Match>()
            .Property(m => m.Category)
            .HasConversion<string>();
    }
}