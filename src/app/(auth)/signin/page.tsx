"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useState} from "react"
import {useRouter} from "next/navigation"
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
    const [role, setRole] = useState<string>("")
    const router = useRouter()

    const handleContinue = () => {
        if (role === "student") {
            router.push("/signin/student")
        } else if (role === "teacher") {
            router.push("/signin/teacher")
        }
    }

    return (
        <div
            className="container min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="flex-1 flex flex-col items-center justify-center gap-8 relative">
                    <div
                        className={`transition-all duration-500 transform ${
                            role === 'teacher' ? 'scale-3d scale-110 opacity-100' : 'scale-90 opacity-40'
                        }`}
                    >
                        <Image
                            src="/teacher.jpg"
                            alt="Teacher"
                            width={300}
                            height={300}
                            className="rounded-lg object-cover"
                            priority
                        />
                        <p className={`text-center mt-4 font-medium ${
                            role === 'teacher' ? 'opacity-100' : 'opacity-40'
                        }`}>
                            Sign in as Teacher
                        </p>
                    </div>

                    <div
                        className={`transition-all duration-500 transform ${
                            role === 'student' ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
                        }`}
                    >
                        <Image
                            src="/student.jpg"
                            alt="Student"
                            width={300}
                            height={300}
                            className="rounded-lg object-cover"
                            priority
                        />
                        <p className={`text-center mt-4 font-medium ${
                            role === 'student' ? 'opacity-100' : 'opacity-40'
                        }`}>
                            Sign in as Student
                        </p>
                    </div>
                </div>

                <div className="mt-auto text-center">
                    <p className="text-sm text-white/60">
                        Choose your role to continue
                    </p>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                            <CardDescription className="text-center">
                                Choose how you want to sign in to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Select onValueChange={setRole}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your role"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Sign in as Student</SelectItem>
                                        <SelectItem value="teacher">Sign in as Teacher</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    className="w-full"
                                    onClick={handleContinue}
                                    disabled={!role}
                                >
                                    Continue
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-sm text-center text-muted-foreground">
                        Don&#39;t have an account?{" "}
                        <Link className="underline text-color-primary hover:text-color-primary/90" href="/signup">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
