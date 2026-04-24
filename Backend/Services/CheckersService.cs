using JayDash.Data.Models.Checkers;
using JayDash.Services.Interfaces;
using JayDash.Data.Models.Checkers.Enums;
using Microsoft.IdentityModel.Tokens;

namespace JayDash.Services;

public class CheckersService : ICheckersService
{
    public async Task<GameBoard> SendMoveToAI(string boardState, CancellationToken cancellationToken)
    {
        var gameBoard = new GameBoard(boardState);

        var validMoves = await this.GetValidMoves(gameBoard, cancellationToken);

        var AIResponse = await this.PostGameToAI(gameBoard, validMoves, cancellationToken);

        return gameBoard;
    }

    internal async Task<GameBoard> PostGameToAI(GameBoard board, List<Move> validMoves, CancellationToken cancellationToken)
    {

        return new GameBoard();
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
                return new Move
                {
                    StartPosition = new PuckPosition(startCell.Row, startCell.Col),
                    EndPosition = new PuckPosition(targetCell.Row, targetCell.Col)
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

        foreach(var row in board.Rows)
        {
            foreach(var cell in row.Cells)
            {
                if (!cell.isPlayable || !cell.HasPuck || cell.Puck.Color == PuckColor.Black) continue;
                var validLeftJumpMoves = ValidateJumpMove(cell, board, Direction.Left);
                if (validLeftJumpMoves is not null) validMoves.AddRange(validLeftJumpMoves);

                var validRightJumpMoves = ValidateJumpMove(cell, board, Direction.Right);
                if (validRightJumpMoves is not null) validMoves.Add(validRightJumpMoves);
            }
        }

        return validMoves;

        static Move? ValidateJumpMove(CheckersCell currentCell, GameBoard board, Direction direction)
        {
            var nextRow = board.Rows.FirstOrDefault(r => r.RowNumber == currentCell.Row + 1);
            if (nextRow is null) return default;

            // validate basic puck jump 
            var oneCellDelta = direction == Direction.Left ? -1 : 1;
            var cellOneAway = nextRow.Cells.FirstOrDefault(c => c.Col == currentCell.Col + oneCellDelta);
            if (cellOneAway is null || !cellOneAway.HasPuck || cellOneAway.Puck.Color == PuckColor.Red) return default;

            var twoRowsAway = board.Rows.FirstOrDefault(r => r.RowNumber == currentCell.Row + 2);
            if (twoRowsAway is null) return default;

            var twoCellDelta = direction == Direction.Left ? -2 : 2;
            var leftCellTwoAway = twoRowsAway.Cells.FirstOrDefault(c => c.Col == currentCell.Col + twoCellDelta);
            if (leftCellTwoAway is null || leftCellTwoAway.HasPuck) return default;

            return new Move
            {
                StartPosition = new PuckPosition(currentCell.Row, currentCell.Col),
                EndPosition = new PuckPosition(leftCellTwoAway.Row, leftCellTwoAway.Col)
            };
        }
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

    private enum Direction
    {
        Left,
        Right
    }
}
