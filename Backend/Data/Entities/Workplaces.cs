using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data.Entities
{
    public class Workplaces
    {
        public int PrimaryKey { get; set; }
        public string BusinessName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string JobDescription { get; set; }
        public string ReasonForLeaving { get; set; }
        public int SupervisorReferencePrimaryKey { get; set; }
    }
}

namespace JayDash.Data
{
    public partial class AppDbContext
    {
        public void OnModelCreating_Workplaces(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Workplaces>(entity =>
            {
                entity.HasKey("PrimaryKey");
            });
        }
    }
}