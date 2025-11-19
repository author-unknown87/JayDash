namespace JayDash.Models
{
    public class Education
    {
        public int PrimaryKey { get; set; }
        public string Institution { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Degree { get; set; }
    }
}
