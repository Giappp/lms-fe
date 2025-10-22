import {useContext} from "react";
import {AuthContext} from "@/contexts/auth-context";


export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {
        user,
        isLoading,
        signIn,
        logOut,
        oauthSignIn,
        mutateUser
    } = context;

    const isAuthorized = (requiredRole: string) => {
        return user?.role === requiredRole;
    };

    return {
        user,
        isLoading,
        signIn,
        logOut,
        oauthSignIn,
        mutateUser,
        isAuthorized
    };
};
