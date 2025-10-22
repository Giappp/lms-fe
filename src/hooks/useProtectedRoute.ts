"use client"
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

interface UseProtectedRouteOptions {
    requiredRole?: string;
    redirectTo?: string;
    onUnauthorized?: () => void;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
    const {requiredRole, redirectTo, onUnauthorized} = options;
    const {user, isLoading, isAuthorized} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Check if user has required role
        if (requiredRole && !isAuthorized(requiredRole)) {
            if (onUnauthorized) {
                onUnauthorized();
            }
            router.push("/unauthorized");
            return;
        }
    }, [isLoading, requiredRole, isAuthorized, router, redirectTo, onUnauthorized]);

    return {
        user,
        isLoading,
        isAuthorized: requiredRole ? isAuthorized(requiredRole) : true,
    };
};