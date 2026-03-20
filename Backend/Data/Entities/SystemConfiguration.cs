using JayDash.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data.Entities
{
    public class SystemConfiguration
    {
        public int PrimaryKey { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}

namespace JayDash.Data
{
    public partial class AppDbContext
    {
        public void OnModelCreating_SystemConfigurations(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SystemConfiguration>(entity =>
            {
                entity.ToTable("SystemConfiguration");
                entity.HasKey("PrimaryKey");
            });
        }
    }
}
