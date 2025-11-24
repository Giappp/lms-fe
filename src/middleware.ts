import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {Constants} from "@/constants";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    sub: string;
    role: "STUDENT" | "TEACHER";
    exp: number;
}

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // 1. Define Route Groups
    const publicRoutes = ["/signin", "/signup", "/verify", "/forgot-password"];
    const studentRoutes = ["/student"]; // Matches /student and /student/*
    const teacherRoutes = ["/teacher"]; // Matches /teacher and /teacher/*

    // 2. Get Token
    const accessToken = request.cookies.get(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN)?.value;

    // --- SCENARIO 1: User is NOT logged in ---
    if (!accessToken) {
        // If trying to access protected routes, redirect to Login
        if (
            studentRoutes.some(path => pathname.startsWith(path)) ||
            teacherRoutes.some(path => pathname.startsWith(path)) ||
            pathname === "/" // Redirect root to signin if not logged in
        ) {
            return NextResponse.redirect(new URL("/signin", request.url));
        }
        return NextResponse.next();
    }

    // --- SCENARIO 2: User IS logged in (Decode Token) ---
    let userRole: string | null = null;
    try {
        const decoded = jwtDecode<DecodedToken>(accessToken);
        userRole = decoded.role;
    } catch (error) {
        // If token is invalid/corrupted, remove cookie and redirect to login
        const response = NextResponse.redirect(new URL("/signin", request.url));
        response.cookies.delete(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        return response;
    }

    // --- SCENARIO 3: Redirect Logged-in users away from Auth pages ---
    if (publicRoutes.some(path => pathname.startsWith(path)) || pathname === "/") {
        if (userRole === "STUDENT") {
            return NextResponse.redirect(new URL("/student", request.url));
        } else if (userRole === "TEACHER") {
            return NextResponse.redirect(new URL("/teacher", request.url));
        }
    }

    // --- SCENARIO 4: Role-Based Access Control (RBAC) ---

    // Prevent STUDENT from accessing TEACHER routes
    if (teacherRoutes.some(path => pathname.startsWith(path)) && userRole === "STUDENT") {
        return NextResponse.redirect(new URL("/student", request.url)); // Bounce them back
    }

    // Prevent TEACHER from accessing STUDENT routes
    if (studentRoutes.some(path => pathname.startsWith(path)) && userRole === "TEACHER") {
        return NextResponse.redirect(new URL("/teacher", request.url)); // Bounce them back
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};