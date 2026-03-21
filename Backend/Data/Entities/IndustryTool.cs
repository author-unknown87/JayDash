using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data.Entities
{
    public class IndustryTool
    {
        public int PrimaryKey { get; set; }

        public string ToolName { get; set; }
    }
}

namespace JayDash.Data
{
    public partial class AppDbContext
    {
        public void OnModelCreating_IndustryTools(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IndustryTool>(entity =>
            {
                entity.HasKey("PrimaryKey");
                entity.ToTable("IndustryTools");
            });
        }
    }
}
