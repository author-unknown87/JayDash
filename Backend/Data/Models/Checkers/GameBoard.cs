using System.Text.Json;

namespace JayDash.Data.Models.Checkers;

public class GameBoard
{
    public ICollection<CheckersRow> Rows { get; set; }

    public string WhoMovedLast { get; set; }

    public GameBoard() { }
    public GameBoard(string gameState)
    {
        // parse game state string
        this.Rows = this.ParseGameState(gameState);
    }

    internal List<CheckersRow> ParseGameState(string gameState)
    {
        var newRows = new List<CheckersRow>();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var boardModel = JsonSerializer.Deserialize<IncomingGameStateModel>(gameState, options);

        for(int rowNumber = 0; rowNumber < boardModel.Rows.Count; rowNumber++)
        {
            var row = boardModel.Rows[rowNumber];

            var newRow = new CheckersRow() { RowNumber = rowNumber };

            for (int cellNumber = 0; cellNumber < row.Count; cellNumber++)
            {
                var cell = row[cellNumber];
                var puck = !string.IsNullOrWhiteSpace(cell.Piece) ? new CheckersPuck(cell) : null;
                var newCell = new CheckersCell()
                {
                    isPlayable = this.determineIfCellIsPlayable(cell.Row, cell.Cell),
                    Puck = puck,
                    Row = rowNumber,
                    Col = cellNumber
                };
                newRow.Cells.Add(newCell);
            }

            newRows.Add(newRow);
        }

        return newRows;
    }

    internal bool determineIfCellIsPlayable(int row, int cell)
    {
        var evenRow = row % 2 == 0;
        var evenCell = cell % 2 == 0;

        return (evenRow && evenCell) || (!evenRow && !evenCell);
    }

    public string GetJson()
    {
        return string.Empty;
    }
}
