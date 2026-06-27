import Header from '../Header/Header'
import styles from './Resume.module.scss'
import ResumeAccordion from './ResumeAccordion/ResumeAccordion'
import { FileDownIcon, BriefcaseBusinessIcon } from 'lucide-react'
import { useEffect, useState } from "react";
import FetchData from '../../hooks/FetchData';
import { HttpAction } from '../../models/enums';
import resumeFile from '../../assets/files/Resume.pdf'
import { 
    ResumeData
 } from '../../models/ResumeModels/CommonResumeModels'

import {
    Alert,
    AlertDescription
 } from "../ui/alert"


export default function Resume() {
    /** Use States */
    const[isSeeking, setIsSeeking] = useState<boolean>(false);
    const[resume, setResume] = useState<ResumeData>();

    /** Helper Methods */
    async function CheckSeekingPositionFlag() {
        const parameters = [
            {key: "configName", value: "SeekingPosition"}
        ];
        const response = await FetchData({endpoint: "SystemConfiguration", action: HttpAction.Get, parameters: parameters});
        const isSeekingPosition = response?.value === "true";
        setIsSeeking(isSeekingPosition);
    }

    async function GetResumeData() {
        const resumeResponse:ResumeData = await FetchData({
            endpoint: "Resume",
            action: HttpAction.Get
        })

        if (resumeResponse !== undefined) {
            setResume(resumeResponse);
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
                            <a href={resumeFile} download>Download Resume as .PDF</a>
                        </AlertDescription>
                    </Alert>
                    <Alert className={`${styles.Alert} ${styles.SeekingPositionAlert} ${!isSeeking ? styles.NotSeeking : ""}`}>
                        <BriefcaseBusinessIcon className={styles.AlertIcon}/>
                        <AlertDescription>
                            <p>Currently seeking opportunities</p>
                        </AlertDescription>
                    </Alert>
                </div>

                <ResumeAccordion resumeData={resume}/>
            </div>
        </>
    )
}