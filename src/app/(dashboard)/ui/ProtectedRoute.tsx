"use client"
import React from "react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import Skeleton from "react-loading-skeleton";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "student" | "teacher";
    redirectTo?: string;
    loadingComponent?: React.ReactNode;
    onUnauthorized?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredRole,
                                                                  redirectTo,
                                                                  loadingComponent,
                                                                  onUnauthorized,
                                                              }) => {
    const {isLoading, isAuthorized} = useProtectedRoute({
        requiredRole,
        redirectTo,
        onUnauthorized,
    });

    if (isLoading) {
        return (
            <>
                {loadingComponent || (
                    <div className="p-6">
                        <Skeleton height={40} width={300} className="mb-4"/>
                        <Skeleton height={200}/>
                    </div>
                )}
            </>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};