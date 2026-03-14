import { Pages } from "../../models/enums";
import { SidebarItems } from "../../models/SidebarItems"
import { Home, BookType, Headset, Folder} from "lucide-react"
import styles from './app-sidebar.module.scss'
import { MarkGithubIcon } from "@primer/octicons-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "../ui/sidebar";

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
        page: Pages.HomePage
    },
    {
        title: "Resume",
        url: "#",
        icon: BookType,
        page: Pages.Resume
    },
    {
        title: "Contact",
        url: "#",
        icon: Headset,
        page: Pages.Contact
    },
    {
        title: "Projects",
        url: "#",
        icon: Folder,
        page: Pages.Projects
    },
    {
        title: "Github",
        url: "https://github.com/author-unknown87/JayDash",
        icon: Folder,
        page: ""
    }
] satisfies readonly SidebarItems[]

interface SidebarProps {
    onClick: (page: string) => void;
}

export function AppSidebar({
    onClick
}: SidebarProps) {
    return (
        <Sidebar>
            <SidebarContent className={styles.Sidebar}>
                <SidebarGroup>
                    <SidebarGroupLabel>Joshua Gravatt's Site</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isGithubLink = item.title === "Github";

                                const Icon = isGithubLink ? MarkGithubIcon : item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}
                                        className="ml-2 my-3"
                                    >
                                        <SidebarMenuButton className="h-12" onClick={() => {
                                            if (!isGithubLink) {
                                                onClick(item.page)
                                            }
                                        }}>
                                            <a href={item.url} target={isGithubLink ? "_blank" : ""} className="w-full">
                                                <Icon className={styles.SidebarIcon}/>         
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}