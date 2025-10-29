"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuth} from "@/hooks/useAuth";

export const RedirectIfNotPendingVerification = ({children}: { children: React.ReactNode }) => {
    const {user, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // If no user, redirect to login
        if (!user) {
            router.replace("/login");
            return;
        }

        if (user.isVerified) {
            if (user.role === "STUDENT") router.replace("/student");
            else if (user.role === "TEACHER") router.replace("/teacher");
            else router.replace("/");
        }
    }, [user, isLoading, router]);

    return <>{children}</>;
};
