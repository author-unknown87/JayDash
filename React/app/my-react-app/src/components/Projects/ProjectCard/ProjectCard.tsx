 import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
 } from "../../ui/card"

interface ProjectCardProps {
    title: string,
    description: string,
    children: React.ReactNode
    onClick?: () => void
}

import styles from './ProjectCard.module.scss'

export default function ProjectCard({
    title,
    description,
    children,
    onClick
}: ProjectCardProps) {
    return (
        <div onClick={onClick}>
            <Card className={styles.ProjectCard}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}