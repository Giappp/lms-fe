import {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
    // const {pathname} = request.nextUrl;
    // const url = new URL(request.url);
    // const token = request.cookies.get("accessToken")?.value;
    //
    // // Public routes that don't require authentication
    // if (pathname.startsWith("/signin") ||
    //     pathname.startsWith("/signup") ||
    //     pathname.startsWith("/forgot-password") ||
    //     pathname.startsWith("/reset-password") ||
    //     pathname.startsWith("/verify") ||
    //     pathname.startsWith("/unauthorized") ||
    //     pathname.startsWith("/oauth") ||
    //     pathname.startsWith("/check-email") ||
    //     pathname === "/") {
    //     return NextResponse.next();
    // }
    //
    // // Redirect to signup if verifying email and no email provided
    // if (pathname === "/verify" && !url.searchParams.get("email")) {
    //     return NextResponse.redirect(new URL("/signup", request.url));
    // }
    //
    // // Check for protected routes
    // if (pathname.startsWith("/student") && !token) {
    //     return NextResponse.redirect(new URL("/signin/student", request.url));
    // }
    //
    // if (pathname.startsWith("/teacher") && !token) {
    //     return NextResponse.redirect(new URL("/signin/teacher", request.url));
    // }
    //
    // // Role-based authorization
    // if (token) {
    //     try {
    //         // You might want to decode the JWT token here to get the role
    //         // For now, we'll use a simple check based on the URL
    //         const isStudentRoute = pathname.startsWith("/student");
    //         const isTeacherRoute = pathname.startsWith("/teacher");
    //         const userRole = isStudentRoute ? Constants.ROLES.STUDENT : Constants.ROLES.TEACHER;
    //
    //         if (isStudentRoute && userRole !== Constants.ROLES.STUDENT) {
    //             return NextResponse.redirect(new URL("/unauthorized", request.url));
    //         }
    //
    //         if (isTeacherRoute && userRole !== Constants.ROLES.TEACHER) {
    //             return NextResponse.redirect(new URL("/unauthorized", request.url));
    //         }
    //     } catch (error) {
    //         return NextResponse.redirect(new URL("/signin", request.url));
    //     }
    // }
    //
    // return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};