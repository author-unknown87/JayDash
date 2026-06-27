namespace JayDash.Data.Models.Checkers;

public class IncomingGameStateModel
{
    public string WhoMovedLast { get; set; }
    public List<List<CellModel>> Rows { get; set; }
}

public class CellModel
{
    public int Row { get; set; }
    public int Cell { get; set; }
    public string Piece { get; set; }
}
