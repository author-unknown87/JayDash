namespace JayDash.Models
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
