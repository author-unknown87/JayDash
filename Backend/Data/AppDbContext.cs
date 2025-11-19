using JayDash.Models;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Database Sets

        public DbSet<Workplaces> Workplaces { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Workplaces>()
                .HasKey(w => w.PrimaryKey);
        }
    }
}
