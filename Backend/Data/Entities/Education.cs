using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data.Entities
{
    public class Education
    {
        public int PrimaryKey { get; set; }

        public string Institution { get; set; }

        public string Description { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Program { get; set; }

        public string GPA { get; set; }
    }
}

namespace JayDash.Data
{
    public partial class AppDbContext
    {
        public void OnModelCreating_Education(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Education>(entity =>
            {
                entity.HasKey("PrimaryKey");
            });
        }
    }
}


