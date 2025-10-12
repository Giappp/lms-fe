import React from 'react'
import "../globals.css";

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {ThemeProvider} from "@/app/ui/ThemeProvider";
import {Toaster} from "@/components/ui/sonner";
import AuthNavbar from "@/app/(auth)/components/AuthNavbar";

config.autoAddCss = false

const AuthLayout = ({
                        children,
                    }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthNavbar/>
            {children}
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>

    )
}
export default AuthLayout
