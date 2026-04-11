import styles from './BoardRowCell.module.scss'
import { useContext } from 'react'
import { ActiveCellContext } from '../../../../../models/CheckersTypes'
import { Coords } from '../../../../../models/CheckersTypes'

// ----- Local Types ----- //
interface BoardRowCellProps {
    hasPuck: boolean,
    color: string
    piece?: string,
    row: number,
    cell: number,
    handleClick: (coords: Coords) => void
}

export default function BoardRowCell({
    hasPuck,
    piece,
    color,
    row,
    cell,
    handleClick
}: BoardRowCellProps) {
    // ----- Component Variables ----- //
    const isRed = piece === 'red'
    const activeCell = useContext(ActiveCellContext);

    // ----- Component Methods ----- //
    function determineColoring(): string {
        // check if coords for active cell match current cell
        if (activeCell.row === row && activeCell.cell === cell) {
            return styles.Highlighted;
        }

        // otherwise, evaluate light or dark coloring
        return (color === 'light' ? styles.Light : styles.Dark);
    }

    function handleCellClick() {
        if (color === 'light' || isRed) return;

        handleClick({row, cell})
    }

    // ----- Component Return ----- //
    return (
        <>
            <div className={`${styles.Cell} ${determineColoring()}`} onClick={handleCellClick}>
                {hasPuck && (
                    <>
                        <div className={`${styles.Puck} ${piece && isRed ? styles.RedPiece : styles.BlackPiece}`} />
                    </>
                )}
            </div>
        </>
    )
}