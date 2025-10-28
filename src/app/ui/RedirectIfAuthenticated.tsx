"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuth} from "@/hooks/useAuth";
import {Constants} from "@/constants";

export const RedirectIfAuthenticated = ({children}: { children: React.ReactNode }) => {
    const {user, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.role === Constants.ROLES.STUDENT) {
                router.replace("/student");
            } else if (user.role === Constants.ROLES.TEACHER) {
                router.replace("/teacher");
            }
        }
    }, [user, router]);

    if (!isLoading && user) return; // or loading screen
    return <>{children}</>;
};
