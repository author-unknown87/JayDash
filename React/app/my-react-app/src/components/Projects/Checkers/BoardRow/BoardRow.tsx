import styles from './BoardRow.module.scss'
import BoardRowCell from './BoardRowCell/BoardRowCell'
import { GameStateCell } from 'src/models/GameStateCell'

interface BoardRowProps {
    rowNumber: number,
    cells: GameStateCell[]
}

export default function BoardRow({
    rowNumber,
    cells
}: BoardRowProps) {

    function determineCellColor(rowNumber: number, idx: number): string {
        if (rowNumber % 2 == 0) {
            return (idx % 2 == 0 ? 'light' : 'dark');
        }

        return (idx % 2 == 0 ? 'dark' : 'light');
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
                        />
                    )
                })}
            </div>
        </>
    )
}