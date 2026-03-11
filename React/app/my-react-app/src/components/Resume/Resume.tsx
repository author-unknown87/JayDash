import Header from '../Header/Header'
import styles from './Resume.module.scss'
import ResumeAccordion from './ResumeAccordion/ResumeAccordion'
import { PaperclipIcon } from 'lucide-react'

import {
    Alert,
    AlertDescription,
    AlertTitle
 } from "../ui/alert"

export default function Resume() {
    return (
        <>
            <div className={styles.Main}>
                <Header />
                <h1>Joshua Gravatt</h1>
                <p>He / Him</p>
                <p className='blurb'>C# / .NET Developer seeking a mid-level position that allows for further technical skill growth and career progression opportunities</p>
                <Alert className={styles.DownloadAlert}>
                    <PaperclipIcon />
                    <AlertDescription>
                        Download Resume as .PDF
                    </AlertDescription>
                </Alert>
                <ResumeAccordion />
            </div>
        </>
    )
}