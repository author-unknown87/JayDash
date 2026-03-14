import styles from './Home.module.scss';
import Header from '../Header/Header'
import headshot from '../../assets/Headshot.jpg'

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
                            <div className={styles.BlurbBit}>
                                <h1>Driven</h1>
                                <p>I am, first and foremost, a dedicated problem solver.  In my working life I’ve shifted gears between three different careers in customer service, data analysis, and software development.  In each case the most satisfying aspects of my work boiled down to the same three-step dance: identify, strategize, and solve.  There’s an intrinsic joy for me in hunting down the bug, designing and implementing the right feature, or refactoring tech debt with just the right design pattern.  I relish the challenge and thrive in mental gridlock.  That being said: brick walls happen.  Developers get stuck and spin their wheels and I am no different.  Collaboration is a strength and no developer is an island.  I have learned from early mistakes and understand seeking a team’s support, or offering it, is key to our long-term strength as software developers.</p>
                            </div>
                            <div className={styles.BlurbBit}>
                                <h1>Growth Minded</h1>
                                <p>Stagnation is an easy trap to fall victim to.  Seeking growth, nurturing the right mindset, is the only way to reliably sidestep this pitfall.  Yet growth isn’t easy—it takes courage because the alternative is feeling comfortable and safe with where you are and what you know.  There is bravery in honest ignorance openly admitted, and with that comes the freedom to correct it.  But there are limits and while we’re developers seeking constant growth we’re also people with mortgages, car payments, and kids.  A driven, growth mindset is a powerful gift but as with all things, moderation is key.</p>
                            </div>
                            <div className={styles.BlurbBit}>
                                <h1>Balanced</h1>
                                <p>Burnout can be just as insidious a trap as stagnation and, enjoy our work as we may, even the most driven developers need down time.  Some of the most talented teammates I’ve known pursued completely offline, non-technical hobbies to balance their lives.  I’ve known gardeners, beekeepers, chicken farmers, chefs, bakers, and community theater stage managers.  All of whom were talented, creative developers by day.  I prefer to play tabletop games, bake, cook, and sew as the mood strikes.  The activities and hobbies don’t necessarily matter as much as the mental relaxation they provide.  As developers we (hopefully) love what we do, but it shouldn’t be all that we do or all that we are.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}       