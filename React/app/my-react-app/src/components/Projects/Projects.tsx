import Header from '../Header/Header'
import styles from './Projects.module.scss'
import ProjectCard from './ProjectCard/ProjectCard'
import Checkerboard from './Checkers/Checkerboard'
import { useState} from 'react'
import checkers from './../../assets/Checkers.jpg'

export default function Projects() {
    /*----- UseState Definitions ----- */
    const [showCheckers, setShowCheckers] = useState<boolean>(false)
    const [showSelection, setShowSelection] = useState<boolean>(true)

    /*----- Local Functions ----- */
    function toggleCheckers() {
        setShowCheckers((curr) => !curr);
        setShowSelection((curr) => !curr)
    }

    return (
        <>
            <div className={styles.Main}>
                <div className={styles.SelectAProject}>
                    <Header />
                    {showSelection && (
                        <>
                        <h1>Project Showcase</h1>
                        <div className={styles.ProjectCardGallery}>
                            <ProjectCard
                                title={"Checkers with Chester"}
                                description={"Play a rousing game of Checkers with Chester, your friendly neighborhood A.I."}
                                onClick={() => toggleCheckers()}
                            >
                                <img src={checkers} alt="Image of Checkers Board" />
                            </ProjectCard>
                        </div>
                        </>
                    )}
                </div>
            {showCheckers && (
                <Checkerboard quitGame={toggleCheckers}/>
            )}
            </div>
        </>
        
    )
}