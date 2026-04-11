import styles from './BoardRow.module.scss'
import BoardRowCell from './BoardRowCell/BoardRowCell'
import { GameStateCell, Coords } from 'src/models/CheckersTypes'

interface BoardRowProps {
    rowNumber: number,
    cells: GameStateCell[],
    handleClick: (coords: Coords) => void
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

    function determinePuck(piece: string): string {
        switch(piece) {
            case "R":
                return "red";
            case "B":
                return "black";
            default:
                return ""
        }
    }

    return (
        <>
            <div className={styles.Row}>
                {cells.map((cell, idx) => {
                    const coloring = determineCellColor(rowNumber, idx);
                    const puck = determinePuck(cell.piece);

                    return (
                        <BoardRowCell 
                                hasPuck={puck !== ""}
                                color={coloring}
                                piece={puck}
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