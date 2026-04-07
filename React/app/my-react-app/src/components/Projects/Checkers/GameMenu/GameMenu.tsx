import styles from './GameMenu.module.scss'

interface GameMenuProps {
    onQuit: () => void
}

export default function GameMenu({
    onQuit
}: GameMenuProps) {
    return (
        <>
            <span onClick={onQuit}>Quit</span> | Save Game | Restart 
        </>
    )
}