"use client"
import React from 'react'
import {ModeToggle} from "@/components/shared/ModeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const DashboardTopbar = () => {
    const {logOut} = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await logOut();
            toast.success("Successfully signed out!");
            router.push("/signin/student");
        } catch (error) {
            toast.error("Failed to sign out");
            console.error("Sign out error:", error);
        }
    };

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
                    <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </div>
            </div>
        </header>
    )
}
export default DashboardTopbar
