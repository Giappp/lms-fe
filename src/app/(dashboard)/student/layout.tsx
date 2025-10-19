import React from 'react'
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {StudentSidebar} from "@/app/(dashboard)/student/ui/StudentSidebar";
import DashboardTopbar from "@/app/(dashboard)/ui/DashboardTopbar";
import {ProtectedRoute} from "@/app/(dashboard)/ui/ProtectedRoute";

const StudentLayout = (props: LayoutProps<"/student">) => {
    return (
        <SidebarProvider style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }>
            <StudentSidebar variant="inset"/>
            <SidebarInset>
                <ProtectedRoute requiredRole="student">
                    <DashboardTopbar/>
                    {props.children}
                </ProtectedRoute>
            </SidebarInset>
        </SidebarProvider>
    )
}
export default StudentLayout
