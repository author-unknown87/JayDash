import styles from './BoardRow.module.scss'
import BoardRowCell from './BoardRowCell/BoardRowCell'

interface BoardRowProps {
    rowNumber: number
}

export default function BoardRow({
    rowNumber
}: BoardRowProps) {
    const rowNumberIsEven = rowNumber % 2 == 0;
    return (
        <>
            <div className={styles.Row}>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'black' : 'red'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'red' : 'black'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'black' : 'red'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'red' : 'black'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'black' : 'red'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'red' : 'black'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'black' : 'red'} />
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'red' : 'black'} />
            </div>
        </>
    )
}