namespace JayDash.Data.Models.Checkers;

public class GameBoard
{
    public ICollection<CheckersRow> Rows { get; set; }

    public GameBoard() { }
    public GameBoard(string gameState)
    {
        // parse game state string
        this.Rows = this.ParseGameState(gameState);
    }

    public string GetJson()
    {
        return string.Empty;
    }

    internal List<CheckersRow> ParseGameState(string gameState)
    {
        var rows = new List<CheckersRow>();

        return rows;
    }
}
