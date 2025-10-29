import React from 'react'
import RedirectIfNotAuthenticated from "@/components/shared/RedirectIfNotAuthenticated";

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
