'use client'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React from "react"
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

// Validation schema with Zod
const loginSchema = z.object({
    email: z
        .email({message: "Invalid email address"})
        .min(1, "Email is required")
        .max(100, "Email must be less than 100 characters"),
    password: z.string().min(8, "Password must be at least 6 characters").regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
        .max(100, "Password must be less than 100 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

const StudentLoginForm = () => {
    const {signIn, oauthSignIn, isLoading} = useAuth();
    const router = useRouter();

    // React Hook Form with Zod validation
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit", // Validate on blur for better UX
    })

    const handleOAuthSignIn = async (provider: "google" | "github") => {
        console.log(`[OAuth Login] Starting ${provider} OAuth sign-in...`);

        try {
            oauthSignIn(provider, "STUDENT");
            console.log(`[OAuth Login] Redirecting to ${provider} OAuth provider`);
            // Note: OAuth redirect happens immediately, so we don't need to handle response here
        } catch (error: any) {
            console.error(`[OAuth Login Error] ${provider} sign-in failed:`, {
                error,
                message: error?.message,
                stack: error?.stack,
            });
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
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            setError("root", {type: "manual", message: message});
        }
    }

    return (
        <Card className="text-text-primary">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign in to continue</CardTitle>
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
                        {isLoading ? (
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
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
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        {errors.root && (
                            <p className="text-sm text-red-500 mt-1">{errors.root.message}</p>
                        )}
                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@example.com"
                                {...register("email")}
                                disabled={isLoading || isSubmitting}
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
                            {(isLoading || isSubmitting) && (
                                <svg
                                    className="mr-2 h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
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
