"use client"
import React from 'react'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGraduationCap} from "@fortawesome/free-solid-svg-icons";
import {ModeToggle} from "@/components/shared/ModeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";

export const NavBar = () => {
    return (
        <header
            className="fixed top-0 left-0 right-0 z-10 backdrop-blur-[20px] shadow-sm bg-white/5">
            <div className="max-w-[1400px] mx-auto flex flex-row justify-between items-center px-4 py-6">
                <Link href="/public"
                      className="flex text-white items-center text-xl md:text-3xl gap-1 font-extrabold transition-all hover:transform-[scale(1.05)]">
                    <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 inline-block align-middle mr-2"/>
                    <span className="leading-none align-middle">EduLearn LMS</span>
                </Link>
                <nav>
                    <ul className="nav-menu">
                        <li><Link href="#features" className="nav-link"
                                  data-translate="landing.nav.features">Features</Link>
                        </li>
                        <li><Link href="#demo" className="nav-link" data-translate="landing.nav.demo">Demo</Link></li>
                        <li><Link href="#pricing" className="nav-link"
                                  data-translate="landing.nav.pricing">Pricing</Link>
                        </li>
                        <li><Link href="#contact" className="nav-link"
                                  data-translate="landing.nav.contact">Contact</Link>
                        </li>
                    </ul>
                </nav>

                <div className="flex gap-1 md:gap-3 items-center">
                    <ModeToggle/>
                    <LanguageToggle/>
                    <Link href="/signin"
                          className="btn btn-small text-white hover:transform-[translateY(-2px)]"
                          style={{background: "rgba(255,255,255,0.1)"}}>Login</Link>
                    <Link href="/signup"
                          className="btn btn-small bg-green-500 text-white font-semibold hover:transform-[translateY(-2px)]">Get
                        Start</Link>
                </div>
            </div>
        </header>
    )
}
