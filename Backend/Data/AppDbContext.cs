using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data
{
    public partial class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Database Sets

        public DbSet<Workplace> Workplaces { get; set; }
        public DbSet<SystemConfiguration> SystemConfigurations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            OnModelCreating_Workplaces(modelBuilder);
            OnModelCreating_SystemConfigurations(modelBuilder);
        }
    }
}
