"use client";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {axiosInstance} from "@/api/core/axiosInstance";
import {Constants} from "@/constants";
import {SignUpData} from "@/types";
import {useRouter} from "next/navigation";
import {signupSchema} from "@/types/schemas";


type FormData = z.infer<typeof signupSchema>;

export default function StudentSignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm<FormData>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });
    const [isOAuthLoading, setIsOAuthLoading] = useState({google: false, github: false});
    const router = useRouter();

    const onOAuth = async (provider: "google" | "github") => {
        setIsOAuthLoading(prev => ({...prev, [provider]: true}));
        try {
        } catch (err: any) {
            console.error(err);
            toast.error("OAuth signup failed");
        } finally {
            setIsOAuthLoading(prev => ({...prev, [provider]: false}));
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const signUpData: SignUpData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                role: "STUDENT",
            };

            await axiosInstance.post(Constants.AUTH_ROUTES.SIGN_UP, signUpData);
            toast.success("Account created. Redirecting...");

            setTimeout(() => {
                router.push('/check-email?email=' + data.email);
            }, 1200);

        } catch (err: any) {
            // Safely extract backend response (if exists)
            const backendMessage: string = err.response?.data?.message;

            if (backendMessage.includes("email")) {
                setError("email", {type: "server", message: backendMessage});
            } else {
                toast.error(backendMessage || "Something went wrong");
            }
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-center">Student Sign up</CardTitle>
                <CardDescription className="text-center">Create an account to join courses and submit
                    assignments</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => onOAuth("google")} disabled={isOAuthLoading.google}>
                        {isOAuthLoading.google ? <span
                                className="animate-spin mr-2 inline-block w-4 h-4 border-2 rounded-full border-current border-t-transparent"></span> :
                            <FontAwesomeIcon icon={faGoogle} className="mr-2"/>}
                        Google
                    </Button>
                    <Button variant="outline" onClick={() => onOAuth("github")} disabled={isOAuthLoading.github}>
                        {isOAuthLoading.github ? <span
                                className="animate-spin mr-2 inline-block w-4 h-4 border-2 rounded-full border-current border-t-transparent"></span> :
                            <FontAwesomeIcon icon={faGithub} className="mr-2"/>}
                        Github
                    </Button>
                </div>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-sm text-neutral-500">Or use your email</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" {...register("firstName")} aria-invalid={!!errors.firstName}/>
                            {errors.firstName &&
                                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" {...register("lastName")} aria-invalid={!!errors.lastName}/>
                            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email}/>
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="grid gap-1 relative">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input id="password" type={showPassword ? "text" : "password"} {...register("password")}
                                   aria-invalid={!!errors.password}/>
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="grid gap-1 relative">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                aria-invalid={!!errors.confirmPassword}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                        {isSubmitting ? "Creating account..." : "Create Student Account"}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account? <Link className="underline" href="/signin/student">Sign in</Link>
                </div>
            </CardFooter>
        </Card>
    );
}
