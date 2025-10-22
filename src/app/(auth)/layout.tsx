import React from 'react'
import AuthNavbar from "@/app/(auth)/ui/AuthNavbar";
import {RedirectIfAuthenticated} from "@/app/ui/RedirectIfAuthenticated";

const AuthLayout = ({
                        children,
                    }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <RedirectIfAuthenticated>
            <AuthNavbar/>
            {children}
        </RedirectIfAuthenticated>
    )
}
export default AuthLayout
