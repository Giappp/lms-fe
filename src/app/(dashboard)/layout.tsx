import React from 'react'
import RedirectIfNotAuthenticated from "@/components/shared/RedirectIfNotAuthenticated";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({
                    children,
                }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <RedirectIfNotAuthenticated>
            {children}
            <Toaster />
        </RedirectIfNotAuthenticated>
    )
}
export default Layout
