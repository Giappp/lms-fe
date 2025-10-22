// src/app/(auth)/signin/ui/TeacherLoginForm.tsx
'use client'
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useAuth} from "@/hooks/useAuth";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const teacherSchema = z.object({
    email: z
        .email({message: "Invalid email address"})
        .min(1, "Email is required")
        .max(100, "Email must be less than 100 characters"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be less than 100 characters"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function TeacherLoginForm() {
    const {signIn, oauthSignIn} = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState({google: false, github: false});

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset
    } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema),
        mode: "onSubmit",
    });

    const handleOAuthSignIn = async (provider: "google" | "github") => {
        setIsOAuthLoading(prev => ({...prev, [provider]: true}));
        try {
            oauthSignIn(provider, "teacher");
            // OAuth will redirect; no further handling here.
        } catch (error: any) {
            console.error(`[OAuth Login Error] ${provider} sign-in failed:`, error);
            toast.error(`Failed to sign in with ${provider}. Please try again.`);
        } finally {
            setIsOAuthLoading(prev => ({...prev, [provider]: false}));
        }
    };

    const onSubmit = async (data: TeacherFormData) => {
        setIsLoading(true);
        console.log("[Teacher Email Login] submitting", {email: data.email});
        try {
            // Pass institution as 4th param if your signIn supports metadata; otherwise adjust to your API.
            const response = await signIn(data.email, data.password, "teacher");
            console.log("[Teacher Email Login] success", response);
            toast.success("Successfully signed in!");
            reset();
            router.push("/teacher/dashboard");
        } catch (error: any) {
            console.error("[Teacher Email Login Error]", error);
            let message = "Failed to sign in. Please check your credentials.";
            if (error?.response?.data?.message) message = error.response.data.message;
            else if (error?.message) message = error.message;
            if (!error?.response) message = "Network error. Please check your internet connection.";
            if (error?.response?.status === 401) message = "Invalid email or password";
            if (error?.response?.status === 500) message = "Server error. Please try again later.";
            toast.error(message);
        } finally {
            setIsLoading(false);
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
                        disabled={isOAuthLoading.google || isLoading}
                    >
                        {isOAuthLoading.google ? (
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <FontAwesomeIcon icon={faGoogle} className="mr-2"/>
                        )}
                        Google
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={() => handleOAuthSignIn("github")}
                        disabled={isOAuthLoading.github || isLoading}
                    >
                        {isOAuthLoading.github ? (
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <FontAwesomeIcon icon={faGithub} className="mr-2"/>
                        )}
                        Github
                    </Button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-text-secondary">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-1">
                        <Label htmlFor="email">Work Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@school.edu"
                            {...register("email")}
                            disabled={isLoading || isSubmitting}
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
                            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                            autoComplete="current-password"
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isLoading || isSubmitting}>
                        {(isLoading || isSubmitting) && (
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
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
