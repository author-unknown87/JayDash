import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody
} from '../../ui/table';

import ContactHoursTableCell from './ContactHoursTableCell/ContactHoursTableCell';
import styles from './ContactHoursTable.module.scss'

export default function ContactHoursTable() {
    return (
        <Table className={styles.HoursTable}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Preferred Hours</TableHead>
                        </TableRow>
                    </TableHeader>
                        <TableBody>
                            <ContactHoursTableCell day="Monday" hours="10:00 - 6:00"/>
                            <ContactHoursTableCell day="Tuesday" hours="12:00 - 6:00"/>
                            <ContactHoursTableCell day="Wednesday" hours="10:00 - 4:00"/>
                            <ContactHoursTableCell day="Thursday" hours="10:00 - 6:00"/>
                            <ContactHoursTableCell day="Friday" hours="10:00 - 6:00"/>
                            <ContactHoursTableCell day="Saturday" hours="--"/>
                            <ContactHoursTableCell day="Sunday" hours="12:00 - 4:00"/>
                        </TableBody>
                </Table>
    )
}