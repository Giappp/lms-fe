"use client"
import {
    faBook,
    faBookOpen,
    faCertificate,
    faChartBar,
    faChartLine,
    faFileAlt,
    faMessage,
    faSignOutAlt,
    faTrophy,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

const menuGroups = [
    {
        title: "Courses",
        subMenus: [
            {title: "My Courses", url: "/teacher/my-courses", icon: faBookOpen},
            {title: "Publish Course", url: "/teacher/create-curriculum", icon: faBook},
        ],
    },
    {
        title: "Students",
        subMenus: [
            {title: "Enrollments", url: "/teacher/enrollments", icon: faTrophy},
        ],
    },
    {
        title: "Assessment",
        subMenus: [
            {title: "Quizzes", url: "/teacher/quizzes", icon: faFileAlt},
            {title: "Templates", url: "/teacher/quizzes/templates", icon: faCertificate},
            {title: "Import (Excel)", url: "/(teacher/quizzes/import", icon: faFileAlt},
        ],
    },
    {
        title: "Insights",
        subMenus: [
            {title: "Analytics", url: "/teacher/analytics", icon: faChartBar},
        ],
    },
    {
        title: "Account",
        subMenus: [
            {title: "Messages", url: "/teacher/messages", icon: faMessage},
            {title: "Certifications", url: "/teacher/certifications", icon: faCertificate},
        ],
    },
];

export function TeacherSidebar({className, ...props}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    const isActive = (url: string) => {
        return pathname === url;
    };
    return (
        <Sidebar collapsible="icon" className={cn("border-r", className)} {...props}>
            <SidebarHeader className="h-14 flex items-center justify-between px-3 border-b">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">LMS</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "transition-colors",
                                        isActive("/teacher") && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <Link href="/teacher">
                                        <FontAwesomeIcon icon={faChartLine} className="w-4 h-4"/>
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {menuGroups.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3">
                            {item.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.subMenus.map((menu) => (
                                    <SidebarMenuItem key={menu.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "transition-colors",
                                                isActive(menu.url) && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            <Link href={menu.url}>
                                                <FontAwesomeIcon icon={menu.icon} className="w-4 h-4"/>
                                                <span>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter className="border-t p-3 flex flex-col gap-2">
                <SidebarMenuButton asChild>
                    <Link href="/student/profile" className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4"/>
                        <span>Profile</span>
                    </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild className="text-destructive hover:text-destructive">
                    <button className="w-full flex items-center gap-2">
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4"/>
                        <span>Sign Out</span>
                    </button>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}