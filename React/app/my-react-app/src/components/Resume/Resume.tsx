import Header from '../Header/Header'
import styles from './Resume.module.scss'
import ResumeAccordion from './ResumeAccordion/ResumeAccordion'
import { FileDownIcon, BriefcaseBusinessIcon } from 'lucide-react'
import { useEffect, useState } from "react";
import FetchData from '../../hooks/FetchData';
import { HttpAction } from '../../models/enums';

import {
    Alert,
    AlertDescription
 } from "../ui/alert"

export default function Resume() {
    /** Use States */
    const[isSeeking, setIsSeeking] = useState<boolean>(false);
    const[resume, setResume] = useState<any>(); // TODO: don't use Any, we have TS, use it

    /** Helper Methods */
    async function CheckSeekingPositionFlag() {
        const parameters = [
            {key: "configName", value: "SeekingPosition"}
        ];

        const response = await FetchData({endpoint: "SystemConfiguration", action: HttpAction.Get, parameters: parameters});
        const isSeekingPosition = response?.data.value === "true";
        setIsSeeking(isSeekingPosition);
    }

    async function GetResumeData() {
        const resumeResponse = await FetchData({
            endpoint: "Resume",
            action: HttpAction.Get
        })

        console.log(resumeResponse);

        if (resumeResponse !== undefined) {
            setResume(resumeResponse.data);
        }
    }

    /** Use Effects  */
    useEffect(() => {
        CheckSeekingPositionFlag();
        GetResumeData();
    }, [])

    /** Return Statement */
    return (
        <>
            <div className={styles.Main}>
                <Header />
                <h1>Joshua Gravatt</h1>
                <p>He / Him</p>
                <p className='blurb'>C# / .NET Developer seeking a mid-level position that allows for further technical skill growth and career progression opportunities</p>
                <div className={styles.AlertsContainer}>
                    <Alert className={`${styles.Alert} ${styles.DownloadAlert}`}>
                        <FileDownIcon className={styles.AlertIcon}/>
                        <AlertDescription>
                            <a href={resume} download>Download Resume as .PDF</a>
                        </AlertDescription>
                    </Alert>
                    <Alert className={`${styles.Alert} ${styles.SeekingPositionAlert} ${!isSeeking ? styles.NotSeeking : ""}`}>
                        <BriefcaseBusinessIcon className={styles.AlertIcon}/>
                        <AlertDescription>
                            <p>Currently seeking opportunities</p>
                        </AlertDescription>
                    </Alert>
                </div>

                <ResumeAccordion />
            </div>
        </>
    )
}