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
                <BoardRowCell hasPuck={true} color={rowNumberIsEven ? 'dark' : 'light'} piece={'black'}/>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'light' : 'dark'} piece={'black'}/>
                <BoardRowCell hasPuck={true} color={rowNumberIsEven ? 'dark' : 'light'} piece={'red'}/>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'light' : 'dark'} piece={'black'}/>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'dark' : 'light'} piece={'red'}/>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'light' : 'dark'} piece={'black'}/>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'dark' : 'light'} piece={'black'}/>
                <BoardRowCell hasPuck={false} color={rowNumberIsEven ? 'light' : 'dark'} piece={'red'}/>
            </div>
        </>
    )
}