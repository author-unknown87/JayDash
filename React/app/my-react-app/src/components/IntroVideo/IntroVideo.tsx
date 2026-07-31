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
                            <p>Video recording pending</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}