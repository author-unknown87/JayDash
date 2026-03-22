using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data.Entities
{
    public class Skill
    {
        public int PrimaryKey { get; set; }
        public string SkillName { get; set; }
        public DateTime StartDate { get; set; }
    }
}

namespace JayDash.Data
{
    public partial class AppDbContext
    {
        public void OnModelCreating_Skills(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Skill>(entity =>
            {
                entity.HasKey("PrimaryKey");
                entity.ToTable("Skills");
            });
        }
    }
}
