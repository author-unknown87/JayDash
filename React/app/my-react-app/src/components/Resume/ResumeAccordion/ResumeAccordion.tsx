/* ---------- Imports */
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "../../ui/accordion"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../ui/table"

import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../ui/card"

import {
    parseISO,
    format
} from 'date-fns'

import styles from './ResumeAccordion.module.scss'
import ResumeTableRow from "./TableRow/ResumeTableRow"
import React from "react"

/* ---------- Interface Definitions */

interface ResumeAccordionProps {
    resumeData: resumeData
}

interface resumeSkill {
    primaryKey: number,
    skillName: string,
    startDate: string
}

interface resumeEducation {
    primaryKey: number,
    institution: string,
    description: string,
    startDate: string,
    endDate: string,
    program: string,
    gpa: string
}

interface resumeWorkplace {
    primaryKey: number,
    companyName: string,
    position: string,
    startDate: string,
    endDate: string,
    jobDescription: string,
    currentPosition: boolean
}

interface resumeTool {
    primaryKey: number,
    toolName: string
}

interface resumeData {
    skills: resumeSkill[],
    education: resumeEducation[],
    workplaces: resumeWorkplace[],
    industryTools: resumeTool[]
}

/* ---------- Return Statement */

export default function ResumeAccordion({
    resumeData
}: ResumeAccordionProps) {

    /* ---------- Helper Functions */
    function BuildSkillsTable(): React.ReactElement[] {
        if (!resumeData || !resumeData.skills) return (<></>);
        const tableRows: React.ReactElement[] = [];
        resumeData.skills.map((skill: resumeSkill) => {
            const row = (<ResumeTableRow skillName={skill.skillName} startDate={skill.startDate} />);
            tableRows.push(row);
        })

        return tableRows;
    }

    function BuildToolsList(): React.ReactElement[] {
        if (!resumeData || !resumeData.industryTools) return (<></>);

        const toolsList: React.ReactElement[] = [];
        resumeData.industryTools.map((tool:resumeTool) => {
            const toolListItem = (<li>{tool.toolName}</li>);
            toolsList.push(toolListItem);
        })

        return toolsList;
    }

    function BuildWorkplaces(): React.ReactElement[] {
        if (!resumeData || !resumeData.workplaces) return (<></>);
        const workplacesList: React.ReactElement[] = [];
        resumeData.workplaces.map((workplace) => {
            const newWorkplace = (
                <Card className={styles.JobCard}>
                    <CardHeader>
                        <CardTitle>{workplace.companyName}</CardTitle>
                        <CardDescription className={styles.HistoryDetails}>
                            <div className={styles.JobTitle}>
                                {workplace.position}
                            </div>
                            <div className={styles.Timeline}>
                                {GetDisplayDate(workplace.startDate)} - {!workplace.endDate ? "Present" : GetDisplayDate(workplace.endDate)}
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{workplace.jobDescription}</p>
                    </CardContent>
                </Card>
            )

            workplacesList.push(newWorkplace);
        })

        return workplacesList;
    }

    function BuildEducation(): React.ReactElement[] {
        if (!resumeData || !resumeData.education) return (<></>);
        const educationList: React.ReactElement[] = [];
        resumeData.education.map((edu) => {
            const newEducation = (
                <Card>
                    <CardHeader>
                        <CardTitle>{edu.description}</CardTitle>
                        <CardDescription>{edu.institution}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableRow>
                                <TableCell>Dates Attended</TableCell>
                                <TableCell>{GetDisplayDate(edu.startDate)} - {GetDisplayDate(edu.endDate)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>GPA</TableCell>
                                <TableCell>{edu.gpa}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Program</TableCell>
                                <TableCell>{edu.program}</TableCell>
                            </TableRow>
                        </Table>
                    </CardContent>
                </Card>
            )

            educationList.push(newEducation);
        })

        return educationList;
    }

    function GetDisplayDate(isoDate: string): string {
        const parsedDate = parseISO(isoDate);
        return format(parsedDate, "MMMM yyyy")
    }

    /* ---------- Return Statement */

    return (
        <>
            <Accordion type="multiple">
                <AccordionItem value="skills" className={styles.AccordionItem}>
                    <AccordionTrigger className={styles.AccordionTrigger}>Technical Skills</AccordionTrigger>
                    <AccordionContent>
                        <Table className="mb-4">
                            <TableHeader>
                                <TableRow className={styles.TableRow}>
                                    <TableHead>Skill name</TableHead>
                                    <TableHead>Years of Experience</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {BuildSkillsTable()}
                            </TableBody>
                        </Table>
                        <Card>
                            <CardHeader>
                                <CardTitle>Industry Tools</CardTitle>
                                <CardDescription>Various tools I am comfortable and familiar with</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className={styles.ToolsList}>
                                    {BuildToolsList()}
                                </ul>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="history" className={styles.AccordionItem}>
                    <AccordionTrigger className={styles.AccordionTrigger}>Work History</AccordionTrigger>
                    <AccordionContent>
                        {BuildWorkplaces()}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="education" className={styles.AccordionItem}>
                    <AccordionTrigger className={styles.AccordionTrigger}>Education</AccordionTrigger>
                    <AccordionContent>
                        {BuildEducation()}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}