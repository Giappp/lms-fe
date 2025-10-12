import React from 'react'
import {ModeToggle} from "@/app/ui/ModeToggle";
import LanguageToggle from "@/app/ui/LanguageToggle";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "@/app/(dashboard)/components/DashboardBreadcrumb";

const DashboardTopbar = () => {
    return (
        <header>
            <div className="flex items-center justify-between px-4 text-foreground shadow-sm h-[60px]">
                <div className="flex justify-center items-center gap-4">
                    <SidebarTrigger/>
                    <DashboardBreadcrumb/>
                </div>
                <div className="flex gap-4 items-center">
                    <ModeToggle/>
                    <LanguageToggle/>
                    <Button variant="outline">Sign Out</Button>
                </div>
            </div>
        </header>
    )
}
export default DashboardTopbar
