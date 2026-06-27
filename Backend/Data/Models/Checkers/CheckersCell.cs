namespace JayDash.Data.Models.Checkers
{
    public class CheckersCell
    {
        public int Row { get; set; }
        public int Col { get; set; }
        public bool isPlayable { get; set; }
        public CheckersPuck Puck { get; set; }
        public bool HasPuck => this.Puck is not null;
    }
}
