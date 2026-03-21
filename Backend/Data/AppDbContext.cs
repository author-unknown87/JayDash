using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data;

public partial class AppDbContext: DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Database Sets

    public DbSet<Workplace> Workplaces { get; set; }
    public DbSet<SystemConfiguration> SystemConfigurations { get; set; }
    public DbSet<Education> Education { get; set; }
    public DbSet<IndustryTool> IndustryTools { get; set; }
    public DbSet<Skill> Skills { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        OnModelCreating_Workplaces(modelBuilder);
        OnModelCreating_SystemConfigurations(modelBuilder);
        OnModelCreating_Education(modelBuilder);
        OnModelCreating_IndustryTools(modelBuilder);
        OnModelCreating_Skills(modelBuilder);
    }
}
