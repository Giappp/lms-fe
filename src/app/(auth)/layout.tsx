import React from 'react'
import AuthNavbar from "@/components/auth/AuthNavbar";

const AuthLayout = ({
                        children,
                    }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <AuthNavbar/>
            {children}
        </>
    )
}
export default AuthLayout
