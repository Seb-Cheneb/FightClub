using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using API.Users.Models;
using API.Features.Brackets.Models;
using API.Features.Clubs.Models;
using API.Features.Competitions.Models;
using API.Features.Fighters.Models;

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
    public DbSet<Club> Clubs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Competition>()
            .HasMany(c => c.Fighters)
            .WithMany(f => f.Competitions)
            .UsingEntity(j => j.ToTable("CompetitionFighters"));

        modelBuilder.Entity<Bracket>()
            .HasMany(b => b.Fighters)
            .WithMany(f => f.Brackets)
            .UsingEntity(j => j.ToTable("BracketFighters"));

        modelBuilder.Entity<Bracket>()
            .HasOne(bracket => bracket.Competition)
            .WithMany(competition => competition.Brackets)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Position>()
            .HasOne(position => position.Bracket)
            .WithMany(bracket => bracket.Positions)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure the one-to-one relationship
        modelBuilder.Entity<AppUser>()
            .HasOne(u => u.Club)
            .WithOne(c => c.AppUser)
            .HasForeignKey<Club>(c => c.AppUserId)
            .IsRequired();

        // Ensure AppUserId in Club is unique
        modelBuilder.Entity<Club>()
            .HasIndex(c => c.AppUserId)
            .IsUnique();

        modelBuilder.Entity<Fighter>()
            .HasOne(f => f.Club)
            .WithMany(c => c.Fighters)
            .HasForeignKey(f => f.ClubId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}