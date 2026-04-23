namespace JayDash.Data.Models.Checkers
{
    public class CheckersRow
    {
        public int RowNumber { get; set; }
        public ICollection<CheckersCell> Cells { get; set; } = new List<CheckersCell>();
    }
}
