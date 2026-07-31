import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../ui/card'
import styles from './HomeCard.module.scss'

interface HomeCardProps {
    title: string,
    content: string
}

export function HomeCard({
    title,
    content
} : HomeCardProps ) {
    return (
        <Card className={styles.CardBody}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    )
}