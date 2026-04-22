import styles from './GameMenu.module.scss'

interface GameMenuProps {
    onQuit: () => void,
    onRestart: () => void
}

export default function GameMenu({
    onQuit,
    onRestart
}: GameMenuProps) {
    return (
        <div className={styles.MenuBar}>
            <span onClick={onQuit}>Quit</span> | <span onClick={onRestart} >Restart</span> 
        </div>
    )
}