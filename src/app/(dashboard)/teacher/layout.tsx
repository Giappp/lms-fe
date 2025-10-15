import React from 'react'
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {StudentSidebar} from "@/app/(dashboard)/student/ui/StudentSidebar";
import {ProtectedRoute} from "@/app/(dashboard)/components/ProtectedRoute";
import DashboardTopbar from "@/app/(dashboard)/components/DashboardTopbar";

const Layout = (props: LayoutProps<"/teacher">) => {
    return (
        <SidebarProvider style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }>
            <StudentSidebar variant="inset"/>
            <SidebarInset>
                <ProtectedRoute requiredRole="teacher">
                    <DashboardTopbar/>
                    {props.children}
                </ProtectedRoute>
            </SidebarInset>
        </SidebarProvider>
    )
}
export default Layout
