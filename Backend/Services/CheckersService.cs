using JayDash.Data.Models.Checkers;
using JayDash.Data.Models.Checkers.Enums;
using JayDash.Data.Models.Responses;
using JayDash.Services.Interfaces;
using OpenAI.Responses;
using System.Text;
using System.Text.Json;

namespace JayDash.Services;

public class CheckersService(IConfiguration _config, ILogger<CheckersService> _logger) : ICheckersService
{
    /// <summary>
    /// Sends the current game board state to the AI and retrieves the AI's chosen move asynchronously.
    /// </summary>
    /// <param name="boardState">A string representation of the current game board state.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the move selected by the AI, or null
    /// if no move is available.</returns>
    public async Task<GetAIMoveResponse> GetMoveFromAI(string boardState, CancellationToken cancellationToken)
    {
        var gameBoard = new GameBoard(boardState);

        var validMoves = await this.GetValidMoves(gameBoard, cancellationToken);

        if (validMoves.Count == 0)
        {
            return new GetAIMoveResponse { EndOfGame = true };
        }

        var chosenMove = await this.PostGameToAI(gameBoard, validMoves, cancellationToken);

        return this.ShapeResponse(gameBoard, chosenMove);
    }

    #region Internal Helper Methods

    internal GetAIMoveResponse ShapeResponse(GameBoard gameBoard, Move? chosenMove)
    {
        try
        {
            // System error during move analysis earlier
            if (chosenMove is null)
            {
                return new GetAIMoveResponse
                {
                    Move = chosenMove,
                    PieceMoved = string.Empty
                };
            }

            var firstPosition = chosenMove.Positions.First();
            var row = gameBoard.Rows.FirstOrDefault(r => r.RowNumber == firstPosition.Row);
            var puck = row.Cells.First(c => c.Col == firstPosition.Col).Puck;
            var piece = puck.Color == PuckColor.Red ? "R" : "B";
            if (puck.IsKing) piece += "K";

            return new GetAIMoveResponse
            {
                Move = chosenMove,
                PieceMoved = piece
            };
        } catch (Exception ex)
        {
            _logger.LogError("Failed to shape AI move response.  Check logs for details.");
            return new GetAIMoveResponse
            {
                Move = null,
                PieceMoved = string.Empty
            };
        }
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
                if (nextRow is null && !cell.Puck.IsKing) continue;

                if (nextRow is not null)
                {
                    var leftCell = nextRow.Cells.FirstOrDefault(c => c.Col == cell.Col - 1);
                    var rightCell = nextRow.Cells.FirstOrDefault(c => c.Col == cell.Col + 1);

                    // Check left
                    var leftMove = validateCellMove(targetCell: leftCell, startCell: cell);
                    if (leftMove is not null) validMoves.Add(leftMove);

                    // Check Right
                    var rightMove = validateCellMove(targetCell: rightCell, startCell: cell);
                    if (rightMove is not null) validMoves.Add(rightMove);
                }

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
    /// Analyzes board state and gets all possible jump moves for Red
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

    /// <summary>
    /// Validates whether a jump move is valid 
    /// </summary>
    /// <param name="startRow"></param>
    /// <param name="startCol"></param>
    /// <param name="board"></param>
    /// <param name="direction"></param>
    /// <returns></returns>
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
                var rightPoint = new Coords(row: startPoint.Row + rowDelta, col: startPoint.Cell + 2);
                var rightValidationResponse = this.checkJumpCoordinates(startPoint, rightPoint, board);
                var rightIsValid = rightValidationResponse.isValid;

                // check left
                var leftPoint = new Coords(row: startPoint.Row + rowDelta, col: startPoint.Cell - 2);
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
                    currentPositions.Add(new PuckPosition(leftPoint.Row, leftPoint.Cell, nextPlayOrder));
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
                    var nextPosition = new PuckPosition(rightPoint.Row, rightPoint.Cell, nextPlayOrder);
                    moveToCheck.move.Positions.Add(nextPosition);
                    moveToCheck.move.JumpedPieces.Add(rightValidationResponse.jumpedPiece!);
                }
                else if (rightIsValid && !leftIsValid)
                {
                    moveToCheck.move.Positions.Add(new PuckPosition(rightPoint.Row, rightPoint.Cell, nextPlayOrder));
                    moveToCheck.move.JumpedPieces.Add(rightValidationResponse.jumpedPiece!);
                }
                else if (!rightIsValid && leftIsValid)
                {
                    moveToCheck.move.Positions.Add(new PuckPosition(leftPoint.Row, leftPoint.Cell, nextPlayOrder));
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

    /// <summary>
    /// Validates a jump move between two coordinates on the game board and identifies the piece being jumped over.
    /// </summary>
    /// <param name="startPoint">The starting coordinates of the jump.</param>
    /// <param name="endPoint">The destination coordinates of the jump.</param>
    /// <param name="board">The game board on which the move is being evaluated.</param>
    /// <returns>A tuple indicating whether the jump is valid and the coordinates of the jumped piece, if any.</returns>
    internal (bool isValid, Coords? jumpedPiece) checkJumpCoordinates(Coords startPoint, Coords endPoint, GameBoard board)
    {
        var colDelta = endPoint.Cell > startPoint.Cell ? 1 : -1;
        var rowDelta = endPoint.Row > startPoint.Row ? 1 : -1;

        var targetRow = board.Rows.FirstOrDefault(r => r.RowNumber == endPoint.Row);
        var nextRow = board.Rows.FirstOrDefault(r => r.RowNumber == startPoint.Row + rowDelta);
        if (targetRow is null || nextRow is null) return (false, null);

        var targetCol = startPoint.Cell + colDelta;
        var cellToJump = nextRow.Cells.FirstOrDefault(c => c.Col == targetCol);
        if (cellToJump is null || !cellToJump.HasPuck || cellToJump.Puck.Color == PuckColor.Red) return (false, null);

        var cellJumpingTo = targetRow.Cells.FirstOrDefault(c => c.Col == endPoint.Cell);
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

    /// <summary>
    /// Sends the current game state and valid moves to the AI service and retrieves the AI's selected move.
    /// </summary>
    /// <param name="board">The current game board state.</param>
    /// <param name="validMoves">A list of valid moves available to the AI.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The move selected by the AI, or null if the response is invalid.</returns>
    internal async Task<Move?> PostGameToAI(GameBoard board, List<Move> validMoves, CancellationToken cancellationToken)
    {
        var key = _config["OpenAI:ApiKey"];
        var model = _config["OpenAI:Model"];
        #pragma warning disable OPENAI001
        var client = new ResponsesClient(apiKey: key);
#pragma warning restore OPENAI001

        var prompt = BuildPrompt(board, validMoves);

        if (string.IsNullOrWhiteSpace(prompt)) return default;

        var response = await client.CreateResponseAsync(model: model,
            userInputText: prompt);

        var rawAIResponse = response.Value.GetOutputText();

        if (int.TryParse(rawAIResponse, out var result))
        {
            return validMoves.ElementAt(result - 1);
        }


        //Error in response from AI
        _logger.LogError("AI response was not able to parse into an INT.  Raw response: {response}", rawAIResponse);
        return default;
    }

    /// <summary>
    /// Builds a prompt string for a checkers AI, including the current board state and a list of possible moves.
    /// </summary>
    /// <param name="board">The current game board.</param>
    /// <param name="validMoves">A list of valid moves for the Red player.</param>
    /// <returns>A formatted prompt string for the AI, or an empty string if an error occurs.</returns>
    internal string BuildPrompt(GameBoard board, List<Move> validMoves)
    {
        try
        {
            var prompt = new StringBuilder("You are a checkers AI. ");
            prompt.AppendLine("You are playing Red, represented as R, or RK for Red King pieces. ");
            var boardStateJson = JsonSerializer.Serialize(board);
            prompt.AppendLine($"Current board state: {boardStateJson}");
            prompt.AppendLine("This is a list of possible Red moves.  Each move is a list of coordinates the piece will move through in order.");
            prompt.AppendLine("Please choose the move you feel to be the most aggressive: ");

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

            prompt.AppendLine("Respond only with the number of your chosen move.  Anything more than that and the response will not work for our needs.");
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
