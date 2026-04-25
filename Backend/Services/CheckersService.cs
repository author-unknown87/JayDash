using JayDash.Data.Models.Checkers;
using JayDash.Data.Models.Checkers.Enums;
using JayDash.Services.Interfaces;
using OpenAI.Responses;
using System.Text;
using System.Text.Json;

namespace JayDash.Services;

public class CheckersService(IConfiguration _config, ILogger<CheckersService> _logger) : ICheckersService
{
    public async Task<GameBoard> SendMoveToAI(string boardState, CancellationToken cancellationToken)
    {
        var gameBoard = new GameBoard(boardState);

        var validMoves = await this.GetValidMoves(gameBoard, cancellationToken);

        var chosenMove = await this.PostGameToAI(gameBoard, validMoves, cancellationToken);

        // TODO: indicate an error to the user if something went wrong here
        if (chosenMove is null) return gameBoard;

        gameBoard = UpdateGameBoard(gameBoard, chosenMove);

        return gameBoard;
    }

    #region Internal Helper Methods

    internal GameBoard UpdateGameBoard(GameBoard board, Move chosenMove)
    {
        var firstPosition = chosenMove.Positions.First();
        var lastPosition = chosenMove.Positions.Last();

        var startingRow = board.Rows.First(r => r.RowNumber == firstPosition.Row);
        var startingCell = startingRow.Cells.First(c => c.Col == firstPosition.Col);
        var movedPuck = startingCell.Puck;
        startingCell.Puck = null;

        var endingRow = board.Rows.First(r => r.RowNumber == lastPosition.Row);
        var endingCell = endingRow.Cells.First(c => c.Col == lastPosition.Col);
        endingCell.Puck = movedPuck;

        // King the piece, if it moved to the back row
        if (endingCell.Row == 7) endingCell.Puck.IsKing = true;

        foreach(var removedPiece in chosenMove.JumpedPieces)
        {
            var targetRow = board.Rows.First(r => r.RowNumber == removedPiece.Row);
            var targetCell = targetRow.Cells.First(c => c.Col == removedPiece.Col);
            targetCell.Puck = null;
        }

        return board;
    }

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
                    moveToCheck.move.Positions.Last().Row,
                    moveToCheck.move.Positions.Last().Col);

                // check right
                var rightPoint = new Coords(row: startPoint.Row + rowDelta, col: startPoint.Col + 2);
                var rightValidationResponse = this.checkJumpCoordinates(startPoint, rightPoint, board);
                var rightIsValid = rightValidationResponse.isValid;

                // check left
                var leftPoint = new Coords(row: startPoint.Row + rowDelta, col: startPoint.Col - 2);
                var leftValidationResponse = this.checkJumpCoordinates(startPoint, leftPoint, board);
                var leftIsValid = leftValidationResponse.isValid;

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
                            Positions = currentPositions,
                            JumpedPieces = new List<Coords> { leftValidationResponse.jumpedPiece! }
                        }
                    });

                    // Add right position to existing move
                    var nextPosition = new PuckPosition(rightPoint.Row, rightPoint.Col, nextPlayOrder);
                    moveToCheck.move.Positions.Add(nextPosition);
                    moveToCheck.move.JumpedPieces.Add(rightValidationResponse.jumpedPiece!);
                }
                else if (rightIsValid && !leftIsValid)
                {
                    moveToCheck.move.Positions.Add(new PuckPosition(rightPoint.Row, rightPoint.Col, nextPlayOrder));
                    moveToCheck.move.JumpedPieces.Add(rightValidationResponse.jumpedPiece!);
                }
                else if (!rightIsValid && leftIsValid)
                {
                    moveToCheck.move.Positions.Add(new PuckPosition(leftPoint.Row, leftPoint.Col, nextPlayOrder));
                    moveToCheck.move.JumpedPieces.Add(leftValidationResponse.jumpedPiece!);
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

    internal (bool isValid, Coords? jumpedPiece) checkJumpCoordinates(Coords startPoint, Coords endPoint, GameBoard board)
    {
        var colDelta = endPoint.Col > startPoint.Col ? 1 : -1;
        var rowDelta = endPoint.Row > startPoint.Row ? 1 : -1;

        var targetRow = board.Rows.FirstOrDefault(r => r.RowNumber == endPoint.Row);
        var nextRow = board.Rows.FirstOrDefault(r => r.RowNumber == startPoint.Row + rowDelta);
        if (targetRow is null || nextRow is null) return (false, null);

        var targetCol = startPoint.Col + colDelta;
        var cellToJump = nextRow.Cells.FirstOrDefault(c => c.Col == targetCol);
        if (cellToJump is null || !cellToJump.HasPuck || cellToJump.Puck.Color == PuckColor.Red) return (false, null);

        var cellJumpingTo = targetRow.Cells.FirstOrDefault(c => c.Col == endPoint.Col);
        if (cellJumpingTo is null || cellJumpingTo.HasPuck) return (false, null);

        return (true, new Coords(cellToJump.Row, cellToJump.Col));
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

    internal async Task<Move?> PostGameToAI(GameBoard board, List<Move> validMoves, CancellationToken cancellationToken)
    {
        var key = _config["OpenAI:ApiKey"];
        #pragma warning disable OPENAI001
        var client = new ResponsesClient(apiKey: key);
#pragma warning restore OPENAI001

        var prompt = BuildPrompt(board, validMoves);

        if (string.IsNullOrWhiteSpace(prompt)) return default;

        //var response = await client.CreateResponseAsync(model: "gpt-5.4-mini",
        //    userInputText: prompt);

        //var rawAIResponse = response.Value.GetOutputText();

        var rawAIResponse = "7";

        if (int.TryParse(rawAIResponse, out var result))
        {
            return validMoves.ElementAt(result - 1);
        }

        // Error in response from AI 
        _logger.LogError("AI response was not able to parse into an INT.  Raw response: {response}", rawAIResponse);
        return default;
    }

    internal string BuildPrompt(GameBoard board, List<Move> validMoves)
    {
        try
        {
            var prompt = new StringBuilder("You are a checkers AI.  You are playing a game against a human opponent. ");
            prompt.AppendLine("You are the Red pieces, identified in the game board here as R, or RK for Red King pieces. ");
            prompt.AppendLine("All I need is for you to reply with the number identifying which move you choose to play and that is it, absolutely nothing else. ");
            prompt.AppendLine("Each move will list the starting coordinates of the Red Puck and will be followed by coordinates for each position it can move to. ");

            var boardStateJson = JsonSerializer.Serialize(board);
            prompt.AppendLine($"This is the current board state in JSON: {boardStateJson}");

            prompt.AppendLine("I will now provide you a list of available, valid moves we have pre-identified for the Red player. ");
            prompt.AppendLine("Please choose the move you feel to be the most aggressive, strategically: ");

            var moveNumber = 1;
            foreach (var move in validMoves)
            {

                prompt.AppendLine($"{moveNumber}. ");
                foreach (var position in move.Positions)
                {
                    prompt.Append($" [{position.Row}, {position.Col}]");
                    if (position != move.Positions.Last()) prompt.Append(" -> ");
                }
                moveNumber++;
            }

            return prompt.ToString();
        } catch (Exception ex)
        {
            _logger.LogError(ex, "Failed building prompt for AI in checkers game.");
            return string.Empty;
        }
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

    #endregion


}
