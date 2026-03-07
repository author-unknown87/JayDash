import './App.css'
import { SidebarProvider, SidebarTrigger} from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import { useState } from 'react'
import { Pages } from './models/enums';
import HomePage from './components/Home/Home';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import Projects from './components/Projects/Projects';

function App() {
  const [selectedPage, setSelectedPage] = useState<string>(Pages.HomePage)

  return (
    <>
      <SidebarProvider>
        <AppSidebar onClick={setSelectedPage}/>
        <main>
            {selectedPage === Pages.HomePage && (
              <HomePage />
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
      </SidebarProvider>
    </>
  )
}

export default App
