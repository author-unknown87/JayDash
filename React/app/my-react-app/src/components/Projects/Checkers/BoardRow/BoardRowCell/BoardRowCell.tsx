import styles from './BoardRowCell.module.scss'

interface BoardRowCellProps {
    hasPuck: boolean,
    color: string
}

export default function BoardRowCell({
    hasPuck,
    color
}: BoardRowCellProps) {


    return (
        <>
            <div className={`${styles.Cell} ${color === 'red' ? styles.Red : styles.Black}`} />
        </>
    )
}