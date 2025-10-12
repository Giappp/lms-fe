import React from 'react'
import {ThemeProvider} from "@/app/ui/ThemeProvider";
import {Toaster} from "@/components/ui/sonner";
import "../globals.css";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}

