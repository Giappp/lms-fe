'use client'
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faChalkboardTeacher, faUserGraduate} from "@fortawesome/free-solid-svg-icons";
import StudentSignUpForm from "../ui/StudentSignUpForm";
import TeacherSignUpForm from "../ui/TeacherSignUpForm";
import Link from "next/link";
import {AnimatePresence, motion} from "framer-motion";

type Role = "student" | "teacher";

const roleMeta = {
    student: {
        title: "Create a Student account",
        subtitle: "Join classes, submit assignments, and track your progress.",
        accent: "text-sky-600",
        icon: faUserGraduate,
        quote: "The beautiful thing about learning is nobody can take it away from you. — B. B. King",
    },
    teacher: {
        title: "Create a Teacher account",
        subtitle: "Manage classes, post materials, and evaluate students.",
        accent: "text-amber-600",
        icon: faChalkboardTeacher,
        quote: "A good teacher can inspire hope, ignite the imagination. — Brad Henry",
    },
} as const;

const formVariants = {
    enter: {opacity: 0, y: 20, scale: 0.95},
    center: {opacity: 1, y: 0, scale: 1},
    exit: {opacity: 0, y: -20, scale: 0.95}
};

const asideVariants = {
    enter: {opacity: 0, x: -20},
    center: {opacity: 1, x: 0},
    exit: {opacity: 0, x: 20}
};

export default function RoleSignUpPage({params}: { params: { role?: string } }) {
    const router = useRouter();
    const initialRole = (params?.role === "teacher" ? "teacher" : "student") as Role;
    const [currentRole, setCurrentRole] = useState<Role>(initialRole);

    useEffect(() => {
        setCurrentRole(initialRole);
    }, [initialRole]);

    const switchRole = (newRole: Role) => {
        if (newRole === currentRole) return;
        router.replace(`/signup/${newRole}`);
    };

    const meta = roleMeta[currentRole];

    return (
        <div className="container relative min-h-screen grid lg:grid-cols-2">
            <AnimatePresence mode="wait">
                <motion.aside
                    key={currentRole}
                    variants={asideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{duration: 0.3, ease: "easeInOut"}}
                    className={[
                        "hidden lg:flex flex-col justify-center p-12",
                        currentRole === "student" ? "bg-sky-50 dark:bg-sky-900/30" : "bg-amber-50 dark:bg-amber-900/20",
                    ].join(" ")}
                >
                    <div className="w-full text-center text-neutral-800 dark:text-neutral-100">
                        <motion.div
                            className="mb-6 text-6xl"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{delay: 0.2}}
                            aria-hidden
                        >
                            <FontAwesomeIcon icon={meta.icon}/>
                        </motion.div>
                        <blockquote className="text-lg italic">
                            &#34;{meta.quote}&#34;
                            <footer className="mt-4 text-sm opacity-80">— Source</footer>
                        </blockquote>
                    </div>
                </motion.aside>
            </AnimatePresence>

            <main className="flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}
                        >
                            <h1 className={`text-base font-semibold ${meta.accent}`}>{meta.title}</h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300">{meta.subtitle}</p>
                        </motion.div>
                        <Link href="/signup" className="flex items-center text-sm text-neutral-500 hover:underline">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>
                            Change role
                        </Link>
                    </div>

                    <motion.div
                        className="flex gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-md"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: 0.1}}
                    >
                        {["student", "teacher"].map((role) => (
                            <button
                                key={role}
                                onClick={() => switchRole(role as Role)}
                                className={`flex-1 py-2 text-center rounded-md focus:outline-none transition-all duration-200 
                                    ${currentRole === role ? "bg-white dark:bg-neutral-800 shadow" : "opacity-80 hover:opacity-100"}`}
                                aria-pressed={currentRole === role}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </motion.div>

                    <section aria-labelledby="role-form" className="w-full">
                        <div id="role-form" className="sr-only">{meta.title}</div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentRole}
                                variants={formVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{duration: 0.3, ease: "easeInOut"}}
                            >
                                {currentRole === "student" ? <StudentSignUpForm/> : <TeacherSignUpForm/>}
                            </motion.div>
                        </AnimatePresence>
                    </section>

                    <motion.div
                        className="text-xs text-neutral-500 dark:text-neutral-400"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3}}
                    >
                        <p>
                            Need an institutional account? Choose Teacher. Personal/student email works for Student
                            accounts.
                        </p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
