import {
    TableCell,
    TableRow
 } from '../../../ui/table'

import { differenceInMonths } from "date-fns"
import styles from './ResumeTableRow.module.scss'

interface ResumeTableRowProps {
    skillName: string,
    startDate: string
}

export default function ResumeTableRow({
    skillName,
    startDate
}: ResumeTableRowProps) {
    function getYearsAndMonthsDifference(startDate: Date):string {
        const today = new Date()
        const months = differenceInMonths(today, startDate);
        const years = Math.floor(months / 12);
        const monthsLeft = months % 12;
        return `${years} years, ${monthsLeft} mo.`
    }

    return (
        <TableRow className={styles.TableRow}>
            <TableCell>{skillName}</TableCell>
            <TableCell>{getYearsAndMonthsDifference(new Date(startDate))}</TableCell>
        </TableRow>
    )
}