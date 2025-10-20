import React from 'react'
import AuthNavbar from "@/app/(auth)/ui/AuthNavbar";

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
