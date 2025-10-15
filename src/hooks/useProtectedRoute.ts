"use client"
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

interface UseProtectedRouteOptions {
    requiredRole?: "student" | "teacher";
    redirectTo?: string;
    onUnauthorized?: () => void;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
    const {requiredRole, redirectTo, onUnauthorized} = options;
    const {user, isLoading, isAuthenticated, isAuthorized} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Check if user is authenticated
        if (!isAuthenticated) {
            const defaultRedirect = requiredRole === "teacher"
                ? "/signin/teacher"
                : "/signin/student";
            router.push(redirectTo || defaultRedirect);
            return;
        }

        // Check if user has required role
        if (requiredRole && !isAuthorized(requiredRole)) {
            if (onUnauthorized) {
                onUnauthorized();
            }
            router.push("/unauthorized");
            return;
        }
    }, [isLoading, isAuthenticated, requiredRole, isAuthorized, router, redirectTo, onUnauthorized]);

    return {
        user,
        isLoading,
        isAuthenticated,
        isAuthorized: requiredRole ? isAuthorized(requiredRole) : isAuthenticated,
    };
};