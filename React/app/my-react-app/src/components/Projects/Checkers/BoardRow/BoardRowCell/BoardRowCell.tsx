import styles from './BoardRowCell.module.scss'

interface BoardRowCellProps {
    hasPuck: boolean,
    color: string
    piece: string
}

export default function BoardRowCell({
    hasPuck,
    piece,
    color
}: BoardRowCellProps) {
    return (
        <>
            <div className={`${styles.Cell} ${color === 'light' ? styles.Light : styles.Dark}`}>
                {hasPuck && (
                    <>
                        <div className={`${styles.Puck} ${piece === 'red' ? styles.RedPiece : styles.BlackPiece}`} />
                    </>
                )}
            </div>
        </>
    )
}