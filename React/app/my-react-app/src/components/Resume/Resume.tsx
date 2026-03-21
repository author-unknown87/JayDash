import Header from '../Header/Header'
import styles from './Resume.module.scss'
import ResumeAccordion from './ResumeAccordion/ResumeAccordion'
import { PaperclipIcon } from 'lucide-react'
import resume from '../../assets/files/Resume.pdf';
import axios from "axios";
import { useEffect } from "react";

import {
    Alert,
    AlertDescription
 } from "../ui/alert"

async function GetSystemConfig() {
    const response = await axios.get("http://localhost:5000/api/SystemConfiguration?configName=SeekingPosition");
    console.log("response: ", response);
}

export default function Resume() {
    useEffect(() => {
        GetSystemConfig();
    }, [])

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
                        <a href={resume} download>Download Resume as .PDF</a>
                    </AlertDescription>
                </Alert>
                <ResumeAccordion />
            </div>
        </>
    )
}