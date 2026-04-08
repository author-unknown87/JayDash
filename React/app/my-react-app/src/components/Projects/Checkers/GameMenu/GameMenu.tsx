import styles from './GameMenu.module.scss'

interface GameMenuProps {
    onQuit: () => void
}

export default function GameMenu({
    onQuit
}: GameMenuProps) {
    return (
        <div className={styles.MenuBar}>
            <span onClick={onQuit}>Quit</span> | <span>Save Game</span> | <span>Load Game</span> | <span>Restart</span> 
        </div>
    )
}