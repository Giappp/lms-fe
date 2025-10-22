import React from 'react'
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import DashboardTopbar from "@/app/(dashboard)/ui/DashboardTopbar";
import {TeacherSidebar} from "@/app/(dashboard)/teacher/ui/TeacherSidebar";

const Layout = (props: LayoutProps<"/teacher">) => {
    return (
        <SidebarProvider style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }>
            <TeacherSidebar variant="inset"/>
            <SidebarInset>
                {/*<ProtectedRoute requiredRole="teacher">*/}
                <DashboardTopbar/>
                {props.children}
                {/*</ProtectedRoute>*/}
            </SidebarInset>
        </SidebarProvider>
    )
}
export default Layout
