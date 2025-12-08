"use client"

import React from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle"
import {faGithub} from "@fortawesome/free-brands-svg-icons"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {useAuth} from "@/hooks/useAuth"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link";
import {SignInData} from "@/types";
import {Constants} from "@/constants";

// IMPROVEMENT: Relaxed schema for Login.
// We remove complex regex because we just want to send whatever the user types to the server.
const studentLoginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof studentLoginSchema>

// Helper component to reduce SVG clutter
const LoadingSpinner = () => (
    <svg
        className="mr-2 h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const StudentLoginForm = () => {
    const {signIn, oauthSignIn, isLoading} = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(studentLoginSchema),
        mode: "onSubmit",
    })

    const handleOAuthSignIn = async (provider: "google" | "github") => {
        try {
            await oauthSignIn(provider, "STUDENT");
        } catch (error: any) {
            console.error(`[OAuth Login Error] ${provider} sign-in failed:`, error);
            toast.error(`Failed to sign in with ${provider}. Please try again.`);
        }
    };

    const onSubmit = async (data: LoginFormData) => {
        const signInData: SignInData = {
            email: data.email,
            password: data.password,
            role: Constants.ROLES.STUDENT,
        };

        try {
            await signIn(signInData);
            toast.success("Successfully signed in!");
            reset();
            router.push("/student");
        } catch (error: any) {
            console.log("Login Error:", error);

            if (error?.errors) {
                Object.keys(error.errors).forEach((key) => {
                    if (key === "email" || key === "password") {
                        setError(key, {type: "server", message: error.errors[key]});
                    } else {
                        setError("root", {type: "server", message: error.errors[key]});
                    }
                });
                return;
            }

            switch (error.errorCode) {
                case 1007:
                    setError("email", {
                        type: "manual",
                        message: "We couldn't find a student account with this email."
                    });
                    break;

                case 1016:
                    setError("root", {
                        type: "manual",
                        message: "Incorrect password or email provided."
                    });
                    break;

                case 1008:
                    setError("email", {
                        type: "manual",
                        message: "This email is already in use."
                    });
                    break;

                default:
                    setError("root", {
                        type: "manual",
                        message: error.message || "An unexpected error occurred."
                    });
            }
        }
    }

    return (
        <Card className="text-text-primary">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Student Sign In</CardTitle>
                <CardDescription className="text-center">
                    Enter your email and password to sign in to your student account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-6">
                    <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={() => handleOAuthSignIn("google")}
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner/> : <FontAwesomeIcon icon={faGoogle} className="mr-2"/>}
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={() => handleOAuthSignIn("github")}
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner/> : <FontAwesomeIcon icon={faGithub} className="mr-2"/>}
                        Github
                    </Button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-text-secondary">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        {/* Root Error Display */}
                        {errors.root && (
                            <div
                                className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive border border-destructive/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-alert-circle">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" x2="12" y1="8" y2="12"/>
                                    <line x1="12" x2="12.01" y1="16" y2="16"/>
                                </svg>
                                <p>{errors.root.message}</p>
                            </div>
                        )}

                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@example.com"
                                {...register("email")}
                                disabled={isLoading || isSubmitting}
                                aria-invalid={!!errors.email}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                                disabled={isLoading || isSubmitting}
                                aria-invalid={!!errors.password}
                                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            disabled={isLoading || isSubmitting}
                        >
                            {(isLoading || isSubmitting) && <LoadingSpinner/>}
                            {(isLoading || isSubmitting) ? "Signing in..." : "Sign In"}
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center text-muted-foreground">
                    Don&#39;t have an account?{" "}
                    <Link className="underline text-color-primary hover:text-color-primary/90" href="/signup/student">
                        Sign up
                    </Link>
                </div>
                <div className="text-sm text-center text-muted-foreground">
                    <Link className="underline text-primary hover:text-primary/90" href="/forgot-password">
                        Forgot your password?
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default StudentLoginForm