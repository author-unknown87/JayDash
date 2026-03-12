import ContactCard from "./ContactCard/ContactCard"
import Styles from './Contact.module.scss';
import Header from '../Header/Header'

export default function Contact() {
    return (
        <>
            <div className={Styles.Main}>
                <Header />
                <h1>Contact Information</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed felis lectus, euismod eget mi eget, rutrum porttitor augue. Nullam dignissim mi ut diam mollis, a tempor urna porta. Integer vestibulum vel sem id iaculis. Aenean vulputate libero ut bibendum imperdiet. Sed sit amet egestas nibh, ac consectetur nibh.</p>
                <div className={Styles.ContactCardGrid}>
                    <ContactCard 
                        className={Styles.ContactCard}
                        title="Phone Number"
                        description="consectetur adipiscing elit. Sed felis lectus"
                        content="513-515-0842"
                    />
                    <ContactCard 
                        className={Styles.ContactCard}
                        title="Email"
                        description="consectetur adipiscing elit. Sed felis lectus"
                        content="j.gravatt87@gmail.com"
                    />
                    <ContactCard 
                        className={Styles.ContactCard}
                        title="LinkedIn"
                        description="consectetur adipiscing elit. Sed felis lectus"
                        content="www.linkedin.com"
                    />
                </div>
            </div>
        </>
    )
}