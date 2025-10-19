"use client"
import React from 'react'
import {ModeToggle} from "@/app/ui/ModeToggle";
import LanguageToggle from "@/app/ui/LanguageToggle";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "@/app/(dashboard)/ui/DashboardBreadcrumb";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const DashboardTopbar = () => {
    const {signOut} = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
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
