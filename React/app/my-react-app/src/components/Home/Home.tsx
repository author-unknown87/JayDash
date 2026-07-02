import styles from './Home.module.scss';
import Header from '../Header/Header'
import headshot from '../../assets/Headshot.jpg'
import { HomeCard } from './HomeCard/HomeCard'

export default function Home() {
    return (
        <>
            <div className={styles.Main}>
                <Header />
                <div className={styles.Content}>
                    <div className={styles.AboutMeWrap}>
                        <img src={headshot} alt="Professional Headshot" />
                        <div className={styles.BlurbArea}>
                            <p className={styles.BlurbHeader}>Joshua Gravatt</p>
                            <HomeCard  
                                title={"Who I Am"} 
                                content={"I'm a full-stack software developer who enjoys building new features, improving existing systems, and solving the kinds of problems that require digging beneath the surface. I work across both backend and frontend development, with experience in C#, .NET, SQL, and React, and I enjoy seeing a feature through from concept to implementation."}
                            />
                            <HomeCard  
                                title={"What I Enjoy"} 
                                content={"What keeps me interested in software development is creative problem solving. Whether I'm debugging a difficult issue, refactoring a system to reduce technical debt, or integrating new technology, I enjoy understanding how systems work and finding practical solutions that make them better."}
                            />
                            <HomeCard  
                                title={"What I've Done"} 
                                content={"My work has primarily focused on full-stack development, often involving complete end-to-end ownership of features rather than specializing in only backend or frontend work. I've built and maintained RESTful APIs, SOAP services, internal tools, automation scripts, and supporting applications that solve real business problems.  Over time I've learned to adapt quickly to whatever a project requires. That has meant writing Python scripts to automate deployment tasks, standing up web applications to streamline internal processes, creating intermediary services for ETL workflows, and learning third-party systems to support customer integrations."}
                            />
                            <HomeCard 
                                title={"What I Value"}
                                content={"I place a strong emphasis on maintainability and long-term design. I believe technical debt becomes significantly more expensive when ignored, and I value building systems that can evolve as requirements change rather than creating short-term solutions that become future obstacles.  While I value persistence and independent problem solving, I also recognize that development is a collaborative process. Working through challenges with teammates, sharing knowledge, and maintaining momentum across a team is just as important as solving the problem itself."}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}       