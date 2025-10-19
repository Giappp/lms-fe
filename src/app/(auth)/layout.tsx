import React from 'react'
import "../globals.css";

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {ThemeProvider} from "@/app/ui/ThemeProvider";
import {Toaster} from "@/components/ui/sonner";
import AuthNavbar from "@/app/(auth)/ui/AuthNavbar";
import {AuthProvider} from "@/contexts/auth-context";

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
            <AuthProvider>
                <AuthNavbar/>
                {children}
                <Toaster/>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>

    )
}
export default AuthLayout
