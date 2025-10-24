import React from 'react'
import RedirectIfNotAuthenticated from "@/app/ui/RedirectIfNotAuthenticated";

const Layout = ({
                    children,
                }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <RedirectIfNotAuthenticated>
            {children}
        </RedirectIfNotAuthenticated>
    )
}
export default Layout
