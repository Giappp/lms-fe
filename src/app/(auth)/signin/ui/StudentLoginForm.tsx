'use client'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle"
import {faGithub} from "@fortawesome/free-brands-svg-icons"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {useAuth} from "@/hooks/useAuth"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"

// Validation schema with Zod
const loginSchema = z.object({
    email: z
        .email({message: "Invalid email address"})
        .min(1, "Email is required")
        .max(100, "Email must be less than 100 characters"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be less than 100 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

const StudentLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState({
        google: false,
        github: false
    });
    const {signIn, oauthSignIn} = useAuth();
    const router = useRouter();

    // React Hook Form with Zod validation
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur", // Validate on blur for better UX
    })

    const handleOAuthSignIn = async (provider: "google" | "github") => {
        setIsOAuthLoading(prev => ({...prev, [provider]: true}));
        console.log(`[OAuth Login] Starting ${provider} OAuth sign-in...`);

        try {
            oauthSignIn(provider, "student");
            console.log(`[OAuth Login] Redirecting to ${provider} OAuth provider`);
            // Note: OAuth redirect happens immediately, so we don't need to handle response here
        } catch (error: any) {
            console.error(`[OAuth Login Error] ${provider} sign-in failed:`, {
                error,
                message: error?.message,
                stack: error?.stack,
            });
            toast.error(`Failed to sign in with ${provider}. Please try again.`);
        } finally {
            setIsOAuthLoading(prev => ({...prev, [provider]: false}));
        }
    };

    const onSubmit = async (data: LoginFormData) => {
        console.log("[Email Login] Starting email login process...");
        console.log("[Email Login] Form data:", {
            email: data.email,
            password: "***hidden***"
        });

        setIsLoading(true);

        try {
            console.log("[Email Login] Sending login request to backend...");

            const response = await signIn(data.email, data.password, "student");

            console.log("[Email Login] Login successful!");
            console.log("[Email Login] Response data:", {
                user: response.user,
                hasAccessToken: !!response.accessToken,
                hasRefreshToken: !!response.refreshToken,
            });

            toast.success("Successfully signed in!");

            // Reset form after successful login
            reset();

            console.log("[Email Login] Redirecting to student dashboard...");
            router.push("/student/dashboard");
        } catch (error: any) {
            console.error("[Email Login Error] Login failed:", {
                error,
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                stack: error?.stack,
            });

            // Extract error message from various possible error formats
            let errorMessage = "Failed to sign in. Please check your credentials.";

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Log specific error cases
            if (error?.response?.status === 401) {
                console.error("[Email Login Error] Invalid credentials provided");
                errorMessage = "Invalid email or password";
            } else if (error?.response?.status === 400) {
                console.error("[Email Login Error] Bad request - validation error");
            } else if (error?.response?.status === 500) {
                console.error("[Email Login Error] Server error");
                errorMessage = "Server error. Please try again later.";
            } else if (!error?.response) {
                console.error("[Email Login Error] Network error - no response from server");
                errorMessage = "Network error. Please check your internet connection.";
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
            console.log("[Email Login] Login process completed");
        }
    }

    return (
        <Card className="w-[400px] text-text-primary">
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
                        disabled={isOAuthLoading.google || isLoading}
                    >
                        {isOAuthLoading.google ? (
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
                        disabled={isOAuthLoading.github || isLoading}
                    >
                        {isOAuthLoading.github ? (
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
                    <a className="underline text-color-primary hover:text-color-primary/90" href="/signup/student">
                        Sign up
                    </a>
                </div>
                <div className="text-sm text-center text-muted-foreground">
                    <a className="underline text-primary hover:text-primary/90" href="/forgot-password">
                        Forgot your password?
                    </a>
                </div>
            </CardFooter>
        </Card>
    )
}

export default StudentLoginForm
