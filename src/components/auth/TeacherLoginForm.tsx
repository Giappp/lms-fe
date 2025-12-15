"use client"

import React from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useAuth} from "@/hooks/useAuth";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {SignInData} from "@/types";
import {Constants} from "@/constants";

const teacherLoginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type TeacherFormData = z.infer<typeof teacherLoginSchema>;

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

export default function TeacherLoginForm() {
    const {signIn, oauthSignIn, isLoading} = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
        reset
    } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherLoginSchema),
        mode: "onSubmit",
    });

    const handleOAuthSignIn = async (provider: "google" | "github") => {
        try {
            oauthSignIn(provider, "TEACHER");
        } catch (error: any) {
            console.error(`[OAuth Login Error] ${provider} sign-in failed:`, error);
            toast.error(`Failed to sign in with ${provider}. Please try again.`);
        }
    };

    const onSubmit = async (data: TeacherFormData) => {
        const signInData: SignInData = {
            email: data.email,
            password: data.password,
            role: Constants.ROLES.TEACHER,
        };
        try {
            await signIn(signInData);
            toast.success("Successfully signed in!");
            reset();
            router.push("/teacher");
        } catch (err: any) {
            if (err.errors) {
                Object.keys(err.errors).forEach((key) => {
                    // Check if the error key matches 'email' or 'password'
                    if (key === "email" || key === "password") {
                        setError(key, {type: "server", message: err.errors[key]});
                    } else {
                        setError("root", {type: "server", message: err.errors[key]});
                    }
                });
                return; // Stop here if we found validation errors
            }

            switch (err.errorCode) {
                case 1007: // USER_NOT_FOUND
                    setError("email", {
                        type: "manual",
                        message: "We couldn't find an account with that email."
                    });
                    break;

                case 1016:
                    setError("root", {
                        type: "manual",
                        message: "The password or email you entered is incorrect."
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
                        message: err.message || "Something went wrong. Please try again."
                    });
            }
        }
    };

    return (
        <Card className="text-text-primary">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Teacher sign in</CardTitle>
                <CardDescription className="text-center">
                    Use your work email to access teacher tools and manage classes
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
                        {isLoading ? <LoadingSpinner/> : <FontAwesomeIcon icon={faGoogle} className="mr-2"/>}
                        Github
                    </Button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-text-secondary">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    {/* Root Error Display */}
                    {errors.root && (
                        <div
                            className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                            {/* You can add an alert icon here */}
                            <p>{errors.root.message}</p>
                        </div>
                    )}
                    <div className="grid gap-1">
                        <Label htmlFor="email">Work Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@school.edu"
                            {...register("email")}
                            disabled={isLoading || isSubmitting}
                            // Add aria-invalid for accessibility
                            aria-invalid={!!errors.email}
                            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            autoComplete="email"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
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
                            autoComplete="current-password"
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isLoading || isSubmitting}>
                        {(isLoading || isSubmitting) && <LoadingSpinner/>}
                        {(isLoading || isSubmitting) ? "Signing in..." : "Sign In as Teacher"}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center text-muted-foreground">
                    Don&#39;t have an account?{" "}
                    <Link className="underline text-color-primary hover:text-color-primary/90" href="/signup/teacher">
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
    );
}
