"use client";

import React, {createContext, useCallback, useEffect, useMemo} from "react";
import {UserResponse} from "@/types/response";
import useSWR from "swr";
import {AuthService} from "@/api/services/auth-service";
import {Constants} from "@/constants";
import {SignInData} from "@/types";
import {axiosInstance} from "@/api/core/axiosInstance";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface AuthContextState {
    user: UserResponse | null;
    isLoading: boolean;
    isValidating: boolean;
    signIn: (data: SignInData) => Promise<void>;
    logOut: () => Promise<void>;
    oauthSignIn: (provider: "google" | "github", role: "STUDENT" | "TEACHER") => void;
    mutateUser: () => Promise<any>;
}

// Fetcher handles 401 gracefully so SWR doesn't retry endlessly for guests
const fetcher = async (url: string): Promise<UserResponse | null> => {
    try {
        const res = await axiosInstance.get(url);
        return res.data.data;
    } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
            return null;
        }
        throw err;
    }
};

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    const shouldFetchUser = useMemo(() => {
        // 1. Check if the Access Token cookie exists
        // Note: We use js-cookie here because we are on the client side
        const hasToken = !!Cookies.get(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

        // 2. If no token exists, there is no point in fetching /me
        // The Middleware handles protecting private routes, so we don't need to panic here.
        if (!hasToken) return false;

        // 3. (Optional) Explicitly disable fetching on Auth pages
        // purely to prevent race conditions during sign-out/redirects
        const authRoutes = ["/signin", "/signup", "/verify", "/forgot-password"];
        if (authRoutes.some(route => pathname.startsWith(route))) return false;

        return true;
    }, [pathname]);

    const {data, isLoading, isValidating, mutate} = useSWR<UserResponse | null>(
        shouldFetchUser ? "/api/auth/me" : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error("Auth Fetch Error:", err);
            }
        }
    );

    const signIn = useCallback(async (data: SignInData) => {
        try {
            const res = await axiosInstance.post(Constants.AUTH_ROUTES.SIGN_IN, data);
            const {accessToken, refreshToken} = res.data.data;

            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

            Cookies.set(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken, {
                expires: 1,
                secure: window.location.protocol === 'https:',
                sameSite: 'strict'
            });

            const decoded: any = jwtDecode(accessToken);
            const role = decoded.role;

            await mutate();

            if (role === "STUDENT") {
                router.push("/student");
            } else if (role === "TEACHER") {
                router.push("/teacher");
            } else {
                // Fallback if role is weird
                router.push("/");
            }
        } catch (normalizedError) {
            console.log("Sign In Error:", normalizedError);
            throw normalizedError;
        }
    }, [mutate, router]);

    const logOut = useCallback(async () => {
        const token = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

        try {
            if (token) {
                await axiosInstance.post(Constants.AUTH_ROUTES.LOGOUT, {
                    refreshToken: token
                });
            }
        } catch (err) {
            console.warn("Logout failed on backend, clearing local state anyway", err);
        } finally {
            // 2. Clear Local State
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

            // 2. Clear Cookie (So Middleware lets us go to /signin)
            Cookies.remove(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

            // 3. Clear SWR Cache
            await mutate(null, false);

            // 4. Redirect
            router.push("/signin");
        }
    }, [mutate, router]);

    const oauthSignIn = (provider: "google" | "github", role: "STUDENT" | "TEACHER") => {
        return AuthService.oauthSignIn(provider, role);
    };

    // Handle Token Expiry event triggered by Axios Interceptor
    useEffect(() => {
        const handleGlobalLogout = async () => {
            await logOut();
        };

        window.addEventListener("auth:logout", handleGlobalLogout);
        return () => window.removeEventListener("auth:logout", handleGlobalLogout);
    }, [logOut]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user: data ?? null,
        isLoading,
        isValidating,
        signIn,
        logOut,
        oauthSignIn,
        mutateUser: async () => await mutate(),
    }), [data, isLoading, isValidating, signIn, logOut, mutate]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};