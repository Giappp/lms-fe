import React from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faChalkboardTeacher, faUserGraduate} from "@fortawesome/free-solid-svg-icons";
import StudentLoginForm from "../ui/StudentLoginForm";
import TeacherLoginForm from "../ui/TeacherLoginForm";

type Role = "student" | "teacher";

const roleMeta: Record<Role, { title: string; subtitle: string; accent: string; icon: any; quote: string }> = {
    student: {
        title: "Sign in as Student",
        subtitle: "Access your courses, assignments, and grades.",
        accent: "text-sky-600",
        icon: faUserGraduate,
        quote: "Learning never exhausts the mind. — Leonardo da Vinci",
    },
    teacher: {
        title: "Sign in as Teacher",
        subtitle: "Manage classes, create assignments, and track progress.",
        accent: "text-amber-600",
        icon: faChalkboardTeacher,
        quote: "Teaching is the greatest act of optimism. — Colleen Wilcox",
    },
};

export default async function RoleSignInPage(props: { params: Promise<{ role?: string }> }) {
    const {role} = await props.params;
    const selectedRole = role === "teacher" ? "teacher" : "student";
    const meta = roleMeta[selectedRole];

    return (
        <div className="container relative min-h-screen grid lg:grid-cols-2">
            {/* Left - illustration / quote - shows only on large screens */}
            <aside
                className={`hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-white/5 to-transparent dark:border-r ${role === "student" ? "bg-sky-50 dark:bg-sky-900/30" : "bg-amber-50 dark:bg-amber-900/20"}`}>
                <div className="w-full text-center text-neutral-800 dark:text-neutral-100">
                    <div className="mb-6 text-6xl" aria-hidden>
                        <FontAwesomeIcon icon={meta.icon}/>
                    </div>
                    <blockquote className="text-lg italic">
                        “{meta.quote}”
                        <footer className="mt-4 text-sm opacity-80">— Source</footer>
                    </blockquote>
                </div>
            </aside>

            {/* Right - form area */}
            <main className="flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-2xl font-semibold ${meta.accent}`}>{meta.title}</h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300">{meta.subtitle}</p>
                        </div>
                        <Link href="/signin" className="flex items-center text-sm text-neutral-500 hover:underline">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>
                            Change role
                        </Link>
                    </div>

                    {/* Role switcher - obvious toggle */}
                    <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-md">
                        <Link
                            href="/signin/student"
                            className={`flex-1 py-2 text-center rounded-md ${role === "student" ? "bg-white dark:bg-neutral-800 shadow" : "opacity-80"}`}
                            aria-pressed={role === "student"}
                        >
                            Student
                        </Link>
                        <Link
                            href="/signin/teacher"
                            className={`flex-1 py-2 text-center rounded-md ${role === "teacher" ? "bg-white dark:bg-neutral-800 shadow" : "opacity-80"}`}
                            aria-pressed={role === "teacher"}
                        >
                            Teacher
                        </Link>
                    </div>

                    {/* Role-specific form */}
                    <section aria-labelledby="role-form" className="w-full">
                        <div id="role-form" className="sr-only">{meta.title}</div>
                        {role === "student" ? (
                            <StudentLoginForm/>
                        ) : (
                            <TeacherLoginForm/>
                        )}
                    </section>

                    {/* Extra helpers */}
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        <p>
                            Not sure which role to use? Use your institutional account for Teacher access, and student
                            email for Student access.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
