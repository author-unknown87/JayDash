import './App.css'
import { SidebarProvider, SidebarTrigger} from './components/ui/sidebar';
import { AppSidebar } from './components/Sidebar/app-sidebar';
import { useState } from 'react'
import { Pages } from './models/enums';
import Home from './components/Home/Home';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import Projects from './components/Projects/Projects';
import styles from './App.module.scss'

function App() {
  const [selectedPage, setSelectedPage] = useState<string>(Pages.HomePage)

  return (
    <>
        <main className={styles.Main}>
          <SidebarProvider>
            <AppSidebar onClick={setSelectedPage}/>
          </SidebarProvider>
          {selectedPage === Pages.HomePage && (
            <Home />
          )}
          {selectedPage === Pages.Resume && (
            <Resume />
          )}
          {selectedPage === Pages.Contact && (
            <Contact />
          )}
          {selectedPage === Pages.Projects && (
            <Projects />
          )}
          {/* <SidebarTrigger />  */}
        </main>
    </>
  )
}

export default App
