using System.ComponentModel.DataAnnotations;

namespace JayDash.Models
{
    public class References
    {
        public int PrimaryKey { get; set; }
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string ContactPreference { get; set; }
    }
}
