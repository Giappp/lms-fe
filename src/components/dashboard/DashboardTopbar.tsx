"use client"
import React from 'react'
import {ModeToggle} from "@/components/shared/ModeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

interface DashboardTopbarProps {
    children?: React.ReactNode;
}

const DashboardTopbar = ({children}: DashboardTopbarProps) => {
    return (
        <header
            className="flex sticky top-0 z-10 h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
            <div className="flex flex-1 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <DashboardBreadcrumb/>
            </div>

            <div className="flex items-center gap-2 px-4">
                {/* This area renders specific actions passed from the parent layout.
                  Example: A teacher might see a "Create Course" button here.
                */}
                <div className="mr-2 hidden md:flex items-center gap-2">
                    {children}
                </div>

                <div className="flex items-center gap-2">
                    <LanguageToggle/>
                    <ModeToggle/>
                </div>
            </div>
        </header>
    )
}

export default DashboardTopbar