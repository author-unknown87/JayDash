import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'

interface CheckerboardProps {
    quitGame: () => void
}

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    return (
        <>
            <h1>Checkers with Chester</h1>
            <GameMenu onQuit={quitGame}/>
            <div className={styles.Board}>
               <BoardRow rowNumber={1} />
               <BoardRow rowNumber={2} />
               <BoardRow rowNumber={3} />
               <BoardRow rowNumber={4} />
               <BoardRow rowNumber={5} />
               <BoardRow rowNumber={6} />
               <BoardRow rowNumber={7} />
               <BoardRow rowNumber={8} /> 
            </div>
        </>
    )
}