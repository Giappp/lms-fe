import React from 'react'
import {Toaster} from "@/components/ui/toaster";

const Layout = ({
                    children,
                }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            {children}
            <Toaster/>
        </>
    )
}
export default Layout
