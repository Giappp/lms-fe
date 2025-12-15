import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGraduationCap} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {ModeToggle} from "@/components/shared/ModeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";

const AuthNavbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-10 h-[64px] shadow-sm bg-color-primary">
            <nav className="flex items-center justify-between xl:max-w-[1280px] mx-auto mt-4">
                <Link href="/"
                      className="flex text-white items-center text-3xl gap-1 font-extrabold transition-all hover:transform-[scale(1.05)]">
                    <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 inline-block align-middle mr-2"/>
                    <span className="leading-none align-middle ">EduLearn LMS</span>
                </Link>

                <div className="flex gap-1 md:gap-3 items-center">
                    <ModeToggle/>
                    <LanguageToggle/>
                </div>
            </nav>
        </header>
    )
}
export default AuthNavbar
