"use client";

import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {CheckCircle, Loader2, XCircle} from 'lucide-react';
import {Constants} from "@/constants";
import axios from "axios";

// 1. Logic component: Handles the token reading and API verification
function VerifyEmailContent() {
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

        axios.post(`${Constants.BACKEND_URL}${Constants.AUTH_ROUTES.VERIFY_EMAIL}?verifyCode=${token}`)
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
        <div className="flex flex-col items-center">
            {status === 'loading' && (
                <>
                    <Loader2 className="h-10 w-10 animate-spin"/>
                    <p className="mt-4 font-medium">Verifying your email...</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <CheckCircle className="h-10 w-10 text-green-500"/>
                    <p className="mt-4 font-medium">Email verified! Redirecting...</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <XCircle className="h-10 w-10 text-red-500"/>
                    <p className="mt-4 font-medium">Invalid or expired link.</p>
                    <button className="mt-4 underline" onClick={() => router.push('/signin')}>
                        Return to sign in
                    </button>
                </>
            )}
        </div>
    );
}

// 2. Main Page: Provides the Suspense Boundary
export default function VerifyEmailPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <Suspense
                fallback={
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin"/>
                        <p className="mt-4 font-medium">Loading verification...</p>
                    </div>
                }
            >
                <VerifyEmailContent/>
            </Suspense>
        </div>
    );
}