namespace JayDash.Data.Models.Checkers;

public class Coords
{
    public int Row { get; set; }
    public int Cell { get; set; }

    public Coords (int row, int col)
    {
        this.Row = row;
        this.Cell = col;
    }
}
