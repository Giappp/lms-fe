"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Loader2, Mail} from "lucide-react";
import {useState} from "react";

export default function CheckEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        if (!email) return;
        setLoading(true);

        await fetch("/api/auth/resend-verification", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email}),
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <Mail className="w-10 h-10"/>
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        We’ve sent a verification link to:
                        <br/>
                        <span className="font-medium text-foreground">{email || "your email"}</span>
                    </p>
                </CardHeader>

                <CardContent className="text-center space-y-6">
                    <p className="text-sm text-muted-foreground">
                        Didn’t receive it? Check your spam or junk folder.
                    </p>

                    <Button
                        className="w-full"
                        disabled={loading}
                        onClick={handleResend}
                        variant="outline"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin"/> Resending...
                            </>
                        ) : (
                            "Resend verification email"
                        )}
                    </Button>

                    <Button
                        className="w-full"
                        variant="link"
                        onClick={() => router.push("/signin")}
                    >
                        Back to sign in
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
