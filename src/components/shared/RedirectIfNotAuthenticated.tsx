"use client"
import React, {useEffect} from 'react'
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";

const RedirectIfNotAuthenticated = ({children}: { children: React.ReactNode }) => {
    const {user, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/signin");
        }
    }, [user, router, isLoading]);

    if (isLoading) return null; // or loading screen
    return <>{children}</>;
}
export default RedirectIfNotAuthenticated
