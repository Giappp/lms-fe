"use client"
import React, {createContext, useCallback, useEffect} from "react";
import {UserResponse} from "@/types/response";
import useSWR, {Fetcher} from "swr";
import {AuthService} from "@/api/services/auth-service";
import {Constants} from "@/constants";
import {SignInData} from "@/types";
import {axiosInstance} from "@/api/core/axiosInstance";
import {setupRefreshInterceptor} from "@/api/core/setupRefreshInterceptor";
import axios from "axios";

interface AuthContextState {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: any;
    signIn: (data: SignInData) => Promise<any>;
    logOut: () => Promise<void>;
    oauthSignIn: (provider: "google" | "github", role: "STUDENT" | "TEACHER") => void;
    mutateUser: () => void;
}

const fetcher: Fetcher<UserResponse, string> = async (url): Promise<UserResponse> => {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (e) {
        throw new Error("Failed to fetch user");
    }
};

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const {data, error, isLoading, mutate: mutateUser} = useSWR<UserResponse | null>(
        "/api/auth/me",
        fetcher,
        {
            revalidateOnFocus: false,      // prevents refetch when switching tabs
            revalidateOnReconnect: false,  // no refetch when internet reconnects
            dedupingInterval: 86400000,    // 24h - prevents multiple refetches in this period
            shouldRetryOnError: false,     // optional: prevents loops on 401 errors
        }
    );

    const signIn = useCallback(async (data: SignInData) => {
        try {
            const res = await axiosInstance.post(Constants.AUTH_ROUTES.SIGN_IN, data).then(res => res.data);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);
            await mutateUser();
        } catch (err: unknown) {
            let errorMessage = "Unknown error";
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message ?? "Login failed";
            }
            // ✅ Throw the error so UI can catch it or SWR UI logic can handle it
            throw new Error(errorMessage);
        }
    }, [mutateUser]);

    const logOut = useCallback(async () => {
        try {
            const res = await axiosInstance.post(Constants.AUTH_ROUTES.LOGOUT).then(res => res.data);
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            await mutateUser(null);
        } catch (err: unknown) {
            let errorMessage = "Unknown error";
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message ?? "Login failed";
            }
            // ✅ Throw the error so UI can catch it or SWR UI logic can handle it
            throw new Error(errorMessage);
        }
    }, [mutateUser]);


    const oauthSignIn = (provider: "google" | "github", role: "STUDENT" | "TEACHER") => {
        return AuthService.oauthSignIn(provider, role);
    };

    useEffect(() => {
        setupRefreshInterceptor(mutateUser);
    }, [mutateUser]);

    return (
        <AuthContext.Provider value={{
            user: data ?? null,
            isAuthenticated: !!data,
            isLoading,
            error,
            signIn,
            logOut,
            oauthSignIn,
            mutateUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
