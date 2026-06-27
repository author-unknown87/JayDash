import styles from './BoardRow.module.scss'
import BoardRowCell from './BoardRowCell/BoardRowCell'
import { GameStateCell, Move} from 'src/models/CheckersTypes'

interface BoardRowProps {
    rowNumber: number,
    cells: GameStateCell[],
    handleClick: (move: Move) => void
}

export default function BoardRow({
    rowNumber,
    cells,
    handleClick
}: BoardRowProps) {

    function determineCellColor(rowNumber: number, idx: number): string {
        if (rowNumber % 2 == 0) {
            return (idx % 2 == 0 ? 'dark' : 'light');
        }
        return (idx % 2 == 0 ? 'light' : 'dark');
    }

    return (
        <>
            <div className={styles.Row}>
                {cells.map((cell, idx) => {
                    const coloring = determineCellColor(rowNumber, idx);

                    return (
                        <BoardRowCell 
                                hasPuck={cell.piece !== ""}
                                color={coloring}
                                piece={cell.piece}
                                row={rowNumber}
                                cell={idx}
                                handleClick={handleClick}
                            />
                    )
                })}
            </div>
        </>
    )
}