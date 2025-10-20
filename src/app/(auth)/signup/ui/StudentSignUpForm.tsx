// `src/app/(auth)/signup/ui/StudentSignUpForm.tsx`
'use client'
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useAuth} from "@/hooks/useAuth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const schema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 6 characters").regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
        .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string().min(1),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function StudentSignUpForm() {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });
    const {signUp} = useAuth();
    const router = useRouter();
    const [isOAuthLoading, setIsOAuthLoading] = useState({google: false, github: false});

    const onOAuth = async (provider: "google" | "github") => {
        setIsOAuthLoading(prev => ({...prev, [provider]: true}));
        try {
            //await oauthSignUp(provider, "student");
            // OAuth handled by provider redirect
        } catch (err: any) {
            console.error(err);
            toast.error("OAuth signup failed");
        } finally {
            setIsOAuthLoading(prev => ({...prev, [provider]: false}));
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            await signUp({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                role: "student"
            });
            toast.success("Account created. Redirecting...");
            router.push("/student/dashboard");
        } catch (err: any) {
            console.error(err);
            const msg = err?.response?.data?.message ?? err?.message ?? "Signup failed";
            toast.error(msg);
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

                    <div className="grid gap-1">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")}
                               aria-invalid={!!errors.password}/>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input id="confirmPassword" type="password" {...register("confirmPassword")}
                               aria-invalid={!!errors.confirmPassword}/>
                        {errors.confirmPassword &&
                            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
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
