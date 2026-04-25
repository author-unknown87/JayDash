using JayDash.Data.Models.Checkers;
using JayDash.Data.Models.Checkers.Enums;
using JayDash.Services.Interfaces;
using Microsoft.Extensions.Options;
using OpenAI.Responses;

namespace JayDash.Services;

public class CheckersService(IConfiguration _config) : ICheckersService
{
    public async Task<GameBoard> SendMoveToAI(string boardState, CancellationToken cancellationToken)
    {
        var gameBoard = new GameBoard(boardState);

        var validMoves = await this.GetValidMoves(gameBoard, cancellationToken);

        var AIResponse = await this.PostGameToAI(gameBoard, validMoves, cancellationToken);

        return gameBoard;
    }

    #region Internal Helper Methods

    /// <summary>
    /// Validates all possible basic, non-jump moves for Red pieces
    /// </summary>
    /// <param name="board"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    internal async Task<List<Move>> GetValidBasicMoves(GameBoard board, CancellationToken cancellationToken)
    {
        var validMoves = new List<Move>();

        foreach (var row in board.Rows)
        {
            foreach (var cell in row.Cells)
            {
                if (!cell.isPlayable || !cell.HasPuck) continue;
                if (cell.Puck.Color == PuckColor.Black) continue;

                // validate forward direction
                var nextRow = board.Rows.FirstOrDefault(r => r.RowNumber == cell.Row + 1);
                if (nextRow is null) continue;
                var leftCell = nextRow.Cells.FirstOrDefault(c => c.Col == cell.Col - 1);
                var rightCell = nextRow.Cells.FirstOrDefault(c => c.Col == cell.Col + 1);

                // Check left
                var leftMove = validateCellMove(targetCell: leftCell, startCell: cell);
                if (leftMove is not null) validMoves.Add(leftMove);

                // Check Right
                var rightMove = validateCellMove(targetCell: rightCell, startCell: cell);
                if (rightMove is not null) validMoves.Add(rightMove);

                // if king, validate backwards directions too
                if (!cell.Puck.IsKing) continue;

                var previousRow = board.Rows.FirstOrDefault(r => r.RowNumber == cell.Row - 1);
                if (previousRow is null) continue;

                // Check back left
                var backLeftCell = previousRow.Cells.FirstOrDefault(c => c.Col == cell.Col - 1);
                var backLeftMove = validateCellMove(targetCell: backLeftCell, startCell: cell);
                if (backLeftMove is not null) validMoves.Add(backLeftMove);

                // Check back right
                var backRightCell = previousRow.Cells.FirstOrDefault(c => c.Col == cell.Col + 1);
                var backRightMove = validateCellMove(targetCell: backRightCell, startCell: cell);
                if (backRightMove is not null) validMoves.Add(backRightMove);
            }
        }

        return validMoves;

        static Move? validateCellMove(CheckersCell? targetCell, CheckersCell startCell)
        {
            // Null guard
            if (targetCell is null) return null;

            if (!targetCell.HasPuck)
            {
                var positions = new List<PuckPosition>()
                {
                    new PuckPosition(startCell.Row, startCell.Col, PlayOrder : 1),
                    new PuckPosition(targetCell.Row, targetCell.Col, PlayOrder : 2)
                };

                return new Move()
                {
                    Positions = positions
                };
            }

            return default;
        }
    }

    /// <summary>
    /// Validates all possible jump moves for red pieces
    /// </summary>
    /// <param name="board"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    internal async Task<List<Move>> GetValidJumpMoves(GameBoard board, CancellationToken cancellationToken)
    {
        var validMoves = new List<Move>();

        foreach (var row in board.Rows)
        {
            foreach (var cell in row.Cells)
            {
                if (!cell.isPlayable || !cell.HasPuck || cell.Puck.Color == PuckColor.Black) continue;

                // Basic jumps
                var validBasicJumpMoves = ValidateJumpMove(cell.Row, cell.Col, board, Direction.Forward);
                if (validBasicJumpMoves is not null) validMoves.AddRange(validBasicJumpMoves);

                if (!cell.Puck.IsKing) continue;

                // backwards jumps
                var validKingJumpMoves = ValidateJumpMove(cell.Row, cell.Col, board, Direction.Backward);
                if (validKingJumpMoves is not null) validMoves.AddRange(validKingJumpMoves);
            }
        }

        return validMoves;
    }

    internal List<Move> ValidateJumpMove(int startRow, int startCol, GameBoard board, Direction direction)
    {
        var movesToCheck = new List<MoveToCheck>();
        var rowDelta = direction == Direction.Forward ? 2 : -2;
        movesToCheck.Add(new MoveToCheck()
        {
            finishedValidation = false,
            isValid = true,
            move = new Move()
            {
                Positions = new List<PuckPosition>()
                {
                    new PuckPosition(startRow, startCol, 1)
                }
            }
        });

        while (movesToCheck.Any(m => !m.finishedValidation))
        {
            var newMoves = new List<MoveToCheck>();
            foreach (var moveToCheck in movesToCheck.Where(m => !m.finishedValidation).ToList())
            {
                var startPoint = new Coords(
                    Row: moveToCheck.move.Positions.Last().Row,
                    Col: moveToCheck.move.Positions.Last().Col);

                // check right
                var rightPoint = new Coords(Row: startPoint.Row + rowDelta, Col: startPoint.Col + 2);
                var rightIsValid = this.checkJumpCoordinates(startPoint, rightPoint, board);

                // check left
                var leftPoint = new Coords(Row: startPoint.Row + rowDelta, Col: startPoint.Col - 2);
                var leftIsValid = this.checkJumpCoordinates(startPoint, leftPoint, board);

                var nextPlayOrder = moveToCheck.move.Positions.Last().PlayOrder + 1;

                if (rightIsValid && leftIsValid)
                {
                    // with two valid moves, we have to assign one position to the current move and create
                    // a totally new move to validate with the other position

                    // Add left position to newly created move
                    var currentPositions = new List<PuckPosition>();
                    currentPositions.AddRange(moveToCheck.move.Positions);
                    currentPositions.Add(new PuckPosition(leftPoint.Row, leftPoint.Col, nextPlayOrder));
                    newMoves.Add(new MoveToCheck()
                    {
                        finishedValidation = false,
                        isValid = true,
                        move = new Move()
                        {
                            Positions = currentPositions
                        }
                    });

                    // Add right position to existing move
                    var nextPosition = new PuckPosition(rightPoint.Row, rightPoint.Col, nextPlayOrder);
                    moveToCheck.move.Positions.Add(nextPosition);
                }
                else if (rightIsValid && !leftIsValid)
                {
                    moveToCheck.move.Positions.Add(new PuckPosition(rightPoint.Row, rightPoint.Col, nextPlayOrder));
                }
                else if (!rightIsValid && leftIsValid)
                {
                    moveToCheck.move.Positions.Add(new PuckPosition(leftPoint.Row, leftPoint.Col, nextPlayOrder));
                }
                else if (!rightIsValid && !leftIsValid)
                {
                    moveToCheck.finishedValidation = true;
                    moveToCheck.isValid = moveToCheck.move.Positions.Count > 1;
                }
            }

            if (newMoves.Any()) movesToCheck.AddRange(newMoves);
        }

        return movesToCheck.Where(m => m.isValid).Select(m => m.move).ToList();
    }

    internal bool checkJumpCoordinates(Coords startPoint, Coords endPoint, GameBoard board)
    {
        var colDelta = endPoint.Col > startPoint.Col ? 1 : -1;
        var rowDelta = endPoint.Row > startPoint.Row ? 1 : -1;

        var targetRow = board.Rows.FirstOrDefault(r => r.RowNumber == endPoint.Row);
        var nextRow = board.Rows.FirstOrDefault(r => r.RowNumber == startPoint.Row + rowDelta);
        if (targetRow is null || nextRow is null) return false;

        var targetCol = startPoint.Col + colDelta;
        var cellToJump = nextRow.Cells.FirstOrDefault(c => c.Col == targetCol);
        if (cellToJump is null || !cellToJump.HasPuck || cellToJump.Puck.Color == PuckColor.Red) return false;

        var cellJumpingTo = targetRow.Cells.FirstOrDefault(c => c.Col == endPoint.Col);
        if (cellJumpingTo is null || cellJumpingTo.HasPuck) return false;

        return true;
    }

    /// <summary>
    /// Validates all potential moves for the red player (the AI)
    /// </summary>
    /// <param name="board"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    internal async Task<List<Move>> GetValidMoves(GameBoard board, CancellationToken cancellationToken)
    {
        var validMoves = new List<Move>();
        var validBasicMoves = await this.GetValidBasicMoves(board, cancellationToken);
        validMoves.AddRange(validBasicMoves);

        var validJumpMoves = await this.GetValidJumpMoves(board, cancellationToken);
        validMoves.AddRange(validJumpMoves);

        return validMoves;
    }

    #endregion

    #region AI Methods

    internal async Task<GameBoard> PostGameToAI(GameBoard board, List<Move> validMoves, CancellationToken cancellationToken)
    {
        var key = _config["OpenAI:ApiKey"];
        #pragma warning disable OPENAI001
        var client = new ResponsesClient(apiKey: key);
        #pragma warning restore OPENAI001

        var response = await client.CreateResponseAsync(model: "gpt-5.4-mini",
            userInputText: "Testing");

        Console.WriteLine(response.Value.GetOutputText());

        return new GameBoard();
    }

    #endregion

    #region Internal Models

    internal enum Direction
    {
        Left,
        Right,
        Forward,
        Backward
    }

    internal class MoveToCheck
    {
        public Move move { get; set; }
        public bool finishedValidation { get; set; }
        public bool isValid { get; set; }
    }

    internal record Coords(int Row, int Col);

    #endregion


}
