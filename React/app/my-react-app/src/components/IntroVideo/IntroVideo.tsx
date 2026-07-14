import styles from './IntroVideo.module.scss'
import Header from '../Header/Header';
 import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
 } from "../ui/card"

export default function IntroVideo() {
    return (
        <>
            <div className={styles.Main}>
                <Header />
                <Card className={styles.VideoCard}>
                    <CardHeader>
                        <CardTitle>My Introductory Video</CardTitle>
                        <CardDescription>A brief video concerning who I am as a developer, my experience, and my current professional goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.Video}>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/jtqtDPOyYNI?si=V5ye78BPlfsXxWpN" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}