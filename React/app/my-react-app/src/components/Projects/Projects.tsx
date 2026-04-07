import Header from '../Header/Header'
import styles from './Projects.module.scss'
import ProjectCard from './ProjectCard/ProjectCard'
import Checkerboard from './Checkers/Checkerboard'
import { useState} from 'react'

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
                                <h1>IMAGE HERE</h1>
                            </ProjectCard>
                            <ProjectCard
                                title={"Mini Dojo Game"}
                                description={"A digitized version of a small tabletop game"}
                            >
                                <h1>IMAGE HERE</h1>
                            </ProjectCard>
                            <ProjectCard
                                title={"Potential Project Title"}
                                description={"Some descriptive text of this project"}
                            >
                                <h1>IMAGE HERE</h1>
                            </ProjectCard>
                            <ProjectCard
                                title={"Potential Project Title"}
                                description={"Some descriptive text of this project"}
                            >
                                <h1>IMAGE HERE</h1>
                            </ProjectCard>
                            <ProjectCard
                                title={"Potential Project Title"}
                                description={"Some descriptive text of this project"}
                            >
                                <h1>IMAGE HERE</h1>
                            </ProjectCard>
                        </div>
                        </>
                    )}
                </div>
            {showCheckers && (
                <div className={styles.CheckersProject}>
                    <Checkerboard quitGame={toggleCheckers}/>
                </div>
            )}
            </div>
        </>
        
    )
}