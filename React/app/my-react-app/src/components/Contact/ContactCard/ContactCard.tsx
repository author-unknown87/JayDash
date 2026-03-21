import { ReactElement } from "react"
import { 
     Card 
    ,CardContent
    ,CardDescription
    ,CardHeader
    ,CardTitle
 } from "../../ui/card"

 import Styles from './ContactCard.module.scss'

interface ContactCardProps {
    title: string,
    description: string,
    content: React.ReactNode,
    className?: string
}

export default function ContactCard({
    title,
    description,
    content,
    className
}: ContactCardProps) {
    return (
        <div className={className}>
            <Card className={Styles.Card}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {content}
                </CardContent>
            </Card>
        </div>
    )
}