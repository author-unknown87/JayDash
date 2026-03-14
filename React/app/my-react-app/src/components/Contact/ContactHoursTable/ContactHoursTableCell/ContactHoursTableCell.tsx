import {
    TableRow,
    TableCell
} from '../../../ui/table';
import styles from './ContactHoursTableCell.module.scss';

interface ContactHoursTableCellProps {
    day: string,
    hours: string
}
export default function ContactHoursTableCell({
    day,
    hours
}: ContactHoursTableCellProps) {
    return (
        <TableRow className={styles.Row}>
            <TableCell>{day}</TableCell>
            <TableCell>{hours}</TableCell>
        </TableRow>
    )
}