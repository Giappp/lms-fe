import React from 'react'
import AuthNavbar from "@/components/auth/AuthNavbar";
import {RedirectIfAuthenticated} from "@/components/shared/RedirectIfAuthenticated";

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
