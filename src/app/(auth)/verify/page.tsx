"use client";

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {CheckCircle, Loader2, XCircle} from 'lucide-react';
import {Constants} from "@/constants";
import axios from "axios";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        console.log("Verify page mounted with token:", token);

        if (!token) {
            setStatus('error');
            return;
        }

        let isMounted = true;

        axios.post(`http://localhost:8081${Constants.AUTH_ROUTES.VERIFY_EMAIL}?verifyCode=${token}`)
            .then(() => {
                if (!isMounted) return;
                console.log("Verification success");
                setStatus('success');
                setTimeout(() => {
                    router.push('/signin?verified=true');
                }, 2000);
            })
            .catch((err) => {
                console.error('Error verifying email:', err.response || err);
                if (isMounted) setStatus('error');
            });

        return () => {
            console.log("Verify page unmounted");
            isMounted = false;
        };
    }, [token, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            {status === 'loading' && (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin"/>
                    <p className="mt-4 font-medium">Verifying your email...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center">
                    <CheckCircle className="h-10 w-10 text-green-500"/>
                    <p className="mt-4 font-medium">Email verified! Redirecting...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center">
                    <XCircle className="h-10 w-10 text-red-500"/>
                    <p className="mt-4 font-medium">Invalid or expired link.</p>
                    <button className="mt-4 underline" onClick={() => router.push('/signin')}>
                        Return to sign in
                    </button>
                </div>
            )}
        </div>
    );
}
