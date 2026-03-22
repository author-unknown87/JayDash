using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data.Entities
{
    public class Workplace
    {
        public int PrimaryKey { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string JobDescription { get; set; }
        public bool CurrentPosition { get; set; }
    }
}

namespace JayDash.Data
{
    public partial class AppDbContext
    {
        public void OnModelCreating_Workplaces(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Workplace>(entity =>
            {
                entity.HasKey("PrimaryKey");
                entity.ToTable("Workplaces");
            });
        }
    }
}