using JayDash.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Data
{
    public class AppDbContextFactory : IAppDbContextFactory
    {
        private string _connectionString { get; set; }

        public AppDbContextFactory(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public AppDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(_connectionString)
                .Options;

            return new AppDbContext(options: options);
        }
    }
}
