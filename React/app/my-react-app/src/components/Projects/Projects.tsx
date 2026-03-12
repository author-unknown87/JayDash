import Header from '../Header/Header'
import styles from './Projects.module.scss'
import ProjectCard from './ProjectCard/ProjectCard'

export default function Projects() {
    return (
        <>
            <div className={styles.Main}>
                <Header />
                <h1>Project Showcase</h1>
                <div className={styles.ProjectCardGallery}>
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
                    <ProjectCard
                        title={"Potential Project Title"}
                        description={"Some descriptive text of this project"}
                    >
                        <h1>IMAGE HERE</h1>
                    </ProjectCard>
                </div>
            </div>
        </>
        
    )
}