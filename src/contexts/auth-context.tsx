"use client"
import React, {createContext, useCallback, useEffect} from "react";
import {UserResponse} from "@/types/response";
import useSWR from "swr";
import {AuthService} from "@/api/services/auth-service";
import {Constants} from "@/constants";
import {SignInData} from "@/types";
import {axiosInstance} from "@/api/core/axiosInstance";
import axios from "axios";
import {usePathname} from "next/navigation";

interface AuthContextState {
    user: UserResponse | null;
    isLoading: boolean;
    signIn: (data: SignInData) => Promise<any>;
    logOut: () => Promise<void>;
    oauthSignIn: (provider: "google" | "github", role: "STUDENT" | "TEACHER") => void;
    mutateUser: () => void;
}

const fetcher = async (url: string): Promise<UserResponse | null> => {
    try {
        const res = await axiosInstance.get(url);
        return res.data.data;
    } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 419)) {
            return null;
        }
        throw err;
    }
};

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const disableAuthCheckRoutes = [
        "/verify",
        "/signin",
        "/signup",
    ];

    const shouldFetchUser = !disableAuthCheckRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const {data, isLoading, mutate} = useSWR<UserResponse | null>(
        shouldFetchUser ? "/api/auth/me" : null, // ✅ SWR won't run when key is null
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
        }
    );


    const signIn = useCallback(async (data: SignInData) => {
        try {
            const res = await axiosInstance.post(Constants.AUTH_ROUTES.SIGN_IN, data).then(res => res.data);
            const {accessToken, refreshToken} = res.data;
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            await mutate();
        } catch (err: unknown) {
            let errorMessage = "Unknown error";
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message ?? "Login failed";
            }
            // ✅ Throw the error so UI can catch it or SWR UI logic can handle it
            throw new Error(errorMessage);
        }
    }, [mutate]);

    const logOut = useCallback(async () => {
        try {
            await axiosInstance.post(Constants.AUTH_ROUTES.LOGOUT);
        } catch (err) {
            console.warn("Logout failed silently", err);
        }
        localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        await mutate(null);
        window.location.href = "/signin";
    }, [mutate]);


    const oauthSignIn = (provider: "google" | "github", role: "STUDENT" | "TEACHER") => {
        return AuthService.oauthSignIn(provider, role);
    };

    useEffect(() => {
        const handleGlobalLogout = async () => {
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

            await mutate(null, false); // ✅ SET STATE TO NULL & DO NOT REFETCH

            if (window.location.pathname !== "/signin") {
                window.location.href = "/signin"; // ✅ Redirect AFTER SWR state is null
            }
        };

        window.addEventListener("auth:logout", handleGlobalLogout);
        return () => window.removeEventListener("auth:logout", handleGlobalLogout);
    }, [mutate]);

    return (
        <AuthContext.Provider value={{
            user: data ?? null,
            isLoading,
            signIn,
            logOut,
            oauthSignIn,
            mutateUser: async () => await mutate(),
        }}>
            {children}
        </AuthContext.Provider>
    );
};
