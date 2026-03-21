import ContactCard from "./ContactCard/ContactCard"
import Styles from './Contact.module.scss';
import Header from '../Header/Header'
import ContactHoursTable from "./ContactHoursTable/ContactHoursTable";

export default function Contact() {
    return (
        <>
            <div className={Styles.Main}>
                <Header />
                <h1>Contact Information</h1>
                <p>Feel free to contact me with any questions, concerns, or position opportunities you feel fit my profile and skillset.  I have no strong communication preferences, though I do check my phone more often than my email or LinkedIn profile.</p>
                <ContactHoursTable />
                <div className={Styles.ContactCardGrid}>
                    <ContactCard 
                        className={Styles.ContactCard}
                        title="Phone Number"
                        description="Call or text, I have no personal preference"
                        content={"513-515-0842"}
                    />
                    <ContactCard 
                        className={Styles.ContactCard}
                        title="Email"
                        description="Checked at least once daily"
                        content={"j.gravatt87@gmail.com"}
                    />
                </div>
            </div>
        </>
    )
}