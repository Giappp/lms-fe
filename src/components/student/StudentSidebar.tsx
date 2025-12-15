"use client"

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAuth} from "@/hooks/useAuth"; // Assuming this exists
import {cn} from "@/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBook,
    faCertificate,
    faChartBar,
    faChartLine,
    faChevronUp,
    faFileAlt,
    faGraduationCap,
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
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

// Define menu items outside component to prevent re-creation on render
const menuList = [
    {
        title: "Learning",
        subMenus: [
            {title: "Browse Courses", url: "/student/courses", icon: faBook},
            {title: "My Progress", url: "/student/my-progress", icon: faChartBar},
        ],
    },
    {
        title: "Enrollment",
        subMenus: [
            {title: "My Enrollments", url: "/student/enrollments", icon: faTrophy},
        ]
    },
    {
        title: "Assessment",
        subMenus: [
            {title: "Available Quizzes", url: "/student/quizzes", icon: faFileAlt},
        ]
    },
    {
        title: "Account",
        subMenus: [
            {title: "Certifications", url: "/student/certifications", icon: faCertificate},
            {title: "Messages", url: "/student/messages", icon: faMessage}
        ]
    }
]

export function StudentSidebar({className, ...props}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const {logOut, user} = useAuth();

    const isActive = (url: string) => pathname === url;

    return (
        <Sidebar collapsible="icon" className={cn("border-r-sidebar-border", className)} {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild
                                           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Link href="/student">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <FontAwesomeIcon icon={faGraduationCap} className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">LMS Platform</span>
                                    <span className="truncate text-xs">Student Portal</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Dashboard Link */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Dashboard"
                                    isActive={isActive("/student")}
                                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                    <Link href="/student">
                                        <FontAwesomeIcon icon={faChartLine}
                                                         className="w-4 h-4 text-muted-foreground/70"/>
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Categorized Menus */}
                {menuList.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel className="text-sidebar-foreground/70">
                            {item.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.subMenus.map((menu) => (
                                    <SidebarMenuItem key={menu.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={menu.title}
                                            isActive={isActive(menu.url)}
                                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        >
                                            <Link href={menu.url}>
                                                <FontAwesomeIcon icon={menu.icon}
                                                                 className="w-4 h-4 text-muted-foreground/70"/>
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

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {/* Replace with actual user image if available */}
                                        <AvatarImage src={user?.avatarUrl} alt={user?.fullName || "User"}/>
                                        <AvatarFallback className="rounded-lg">S</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span
                                            className="truncate font-semibold">{user?.fullName || "Student Name"}</span>
                                        <span className="truncate text-xs">{user?.email || "student@lms.com"}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronUp} className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user?.avatarUrl} alt={user?.fullName}/>
                                            <AvatarFallback className="rounded-lg">S</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span
                                                className="truncate font-semibold">{user?.fullName || "Student Name"}</span>
                                            <span className="truncate text-xs">{user?.email || "student@lms.com"}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <Link href="/student/profile" className="cursor-pointer">
                                        <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4"/>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/student/certifications" className="cursor-pointer">
                                        <FontAwesomeIcon icon={faCertificate} className="mr-2 h-4 w-4"/>
                                        Certificates
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={logOut}
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4"/>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}