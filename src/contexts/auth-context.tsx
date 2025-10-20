"use client"
import React, {createContext} from "react";
import {UserResponse} from "@/types/response";
import useSWR, {SWRConfiguration} from "swr";
import {AuthService} from "@/api/services/auth-service";
import {Constants} from "@/constants";

interface AuthContextState {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: any;
    signIn: (email: string, password: string, role: "student" | "teacher") => Promise<any>;
    signUp: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: "student" | "teacher";
    }) => Promise<any>;
    signOut: () => Promise<void>;
    oauthSignIn: (provider: "google" | "github", role: "student" | "teacher") => void;
    mutate: () => Promise<any>;
}

const TOKEN_FETCHER = async () => {
    const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) return null;
    return await AuthService.verifyToken(accessToken);
};

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const {data, error, isLoading, mutate} = useSWR<UserResponse | null>(
        typeof window !== 'undefined' && localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
            ? "auth-user"
            : null,
        TOKEN_FETCHER,
        {
            revalidateOnFocus: false,
            refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
        } as SWRConfiguration
    );

    const signIn = async (email: string, password: string, role: "student" | "teacher") => {
        try {
            const response = await AuthService.signIn({email, password, role});
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
            await mutate(response.user);
            return response;
        } catch (error) {
            await mutate(null, {revalidate: false});
            throw error;
        }
    };

    const signUp = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: "student" | "teacher";
    }) => {
        try {
            const response = await AuthService.signUp(data);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
            localStorage.setItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
            await mutate(response.user);
            return response;
        } catch (error) {
            await mutate(null, {revalidate: false});
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const refreshToken = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(Constants.LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            await mutate(null, {revalidate: false});
        }
    };

    const oauthSignIn = (provider: "google" | "github", role: "student" | "teacher") => {
        return AuthService.oauthSignIn(provider, role);
    };

    return (
        <AuthContext.Provider value={{
            user: data ?? null,
            isAuthenticated: !!data,
            isLoading,
            error,
            signIn,
            signUp,
            signOut,
            oauthSignIn,
            mutate,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
