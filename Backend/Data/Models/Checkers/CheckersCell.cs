namespace JayDash.Data.Models.Checkers
{
    public class CheckersCell
    {
        public bool isPlayable { get; set; }
        public CheckersPuck Puck { get; set; }
        public bool HasPuck => this.Puck is not null;
    }
}
