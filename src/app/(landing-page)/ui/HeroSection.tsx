import React from 'react'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAtom,
    faBook,
    faCalculator,
    faChartLine,
    faCheck,
    faDna,
    faGlobe,
    faGraduationCap,
    faMicroscope,
    faMusic,
    faPalette,
    faPencil,
    faPlay,
    faRocket
} from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="floating-icons">
                {/* Heroicons */}
                <FontAwesomeIcon icon={faGraduationCap}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "10%", left: "5%", animationDelay: "0s"}}
                />
                <FontAwesomeIcon icon={faBook}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "20%", left: "85%", animationDelay: "2s"}}
                />
                <FontAwesomeIcon icon={faPencil}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "70%", left: "10%", animationDelay: "4s"}}
                />
                <FontAwesomeIcon icon={faMicroscope}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "60%", left: "90%", animationDelay: "1s"}}
                />
                <FontAwesomeIcon icon={faAtom}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "80%", left: "60%", animationDelay: "5s"}}
                />
                <FontAwesomeIcon icon={faCalculator} className="floating-icon w-12 h-12 text-white"
                                 style={{top: "80%", left: "30%", animationDelay: "5s"}}/>
                <FontAwesomeIcon icon={faGlobe}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "15%", left: "40%", animationDelay: "2.5s"}}
                />
                <FontAwesomeIcon icon={faDna}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "50%", left: "30%", animationDelay: "4.5s"}}
                />
                <FontAwesomeIcon icon={faPalette}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "40%", left: "5%", animationDelay: "3.5s"}}
                />
                <FontAwesomeIcon icon={faMusic}
                                 className="floating-icon w-12 h-12 text-white"
                                 style={{top: "85%", left: "80%", animationDelay: "3.5s"}}
                />

                {/* Formulas */}
                <div
                    className="formula text-lg font-bold text-white"
                    style={{top: "25%", animationDelay: "0s"}}
                >
                    E = mc²
                </div>
                <div
                    className="formula text-lg font-bold text-white"
                    style={{top: "45%", animationDelay: "5s"}}
                >
                    ∫f(x)dx
                </div>
                <div
                    className="formula text-lg font-bold text-white"
                    style={{top: "65%", animationDelay: "10s"}}
                >
                    πr²
                </div>
                <div
                    className="formula text-lg font-bold text-white"
                    style={{top: "85%", animationDelay: "15s"}}
                >
                    a² + b² = c²
                </div>
            </div>

            <div className="hero-content">
                <div className="hero-text">
                    <h1 data-translate="landing.hero.title">Transform Your Learning Experience</h1>
                    <p className="subtitle" data-translate="landing.hero.subtitle">
                        Comprehensive Learning Management System that empowers educators and engages students with
                        modern tools and interactive features.
                    </p>
                    <div className="hero-actions">
                        <Link href="#roles" className="btn-hero primary" data-translate="landing.hero.getStarted">
                            <FontAwesomeIcon icon={faRocket} className="w-6 h-6"/>
                            Get Started Free
                        </Link>
                        <Link href="#demo" className="btn-hero secondary" data-translate="landing.hero.watchDemo">
                            <FontAwesomeIcon icon={faPlay} className="w-6 h-6"/>
                            Watch Demo
                        </Link>
                    </div>
                    <div className="hero-features">
                        <div className="hero-feature">
                            <FontAwesomeIcon icon={faCheck} className="w-6 h-6 text-[#10B981]"/>
                            <span data-translate="landing.hero.feature1">No Credit Card Required</span>
                        </div>
                        <div className="hero-feature">
                            <FontAwesomeIcon icon={faCheck} className="w-6 h-6 text-[#10B981]"/>
                            <span data-translate="landing.hero.feature2">30-Day Free Trial</span>
                        </div>
                        <div className="hero-feature">
                            <FontAwesomeIcon icon={faCheck} className="w-6 h-6 text-[#10B981]"/>
                            <span data-translate="landing.hero.feature3">Easy Setup</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual relative w-full flex justify-center">
                    <div className="hero-mockup w-full max-w-xl">
                        <div className="hero-mockup-content">
                            {/* Top Card */}
                            <div
                                className="rounded-xl p-5 mb-4 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md shadow-black/10">
                                <div
                                    className="h-3.5 w-2/3 mb-2 rounded-lg bg-gradient-to-r from-blue-800 to-blue-600 shadow-md shadow-blue-800/30"/>
                                <div className="h-2 mb-1.5 rounded bg-slate-300"/>
                                <div className="h-2 w-5/6 rounded bg-slate-300 "/>
                            </div>

                            {/* Middle Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Card 1 */}
                                <div
                                    className="rounded-xl p-4 text-center bg-gradient-to-br from-blue-100 to-blue-200 shadow-md shadow-blue-500/20 transition-transform duration-300 hover:scale-105">
                                    <div
                                        className="h-6 w-6 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/40"/>
                                    <div className="h-1.5 mb-1 rounded bg-blue-400"/>
                                    <div className="h-1.5 w-3/4 rounded bg-blue-300"/>
                                </div>

                                {/* Card 2 */}
                                <div
                                    className="rounded-xl p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 shadow-md shadow-blue-500/20 transition-transform duration-300 hover:scale-105">
                                    <div
                                        className="h-6 w-6 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/40"/>
                                    <div className="h-1.5 mb-1 rounded bg-blue-400"/>
                                    <div className="h-1.5 w-3/4 rounded bg-blue-300"/>
                                </div>
                            </div>

                            {/* Bottom Card */}
                            <div
                                className="mt-4 rounded-xl p-4 bg-gradient-to-br from-sky-50 to-blue-100 shadow-md shadow-blue-500/30">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white font-bold shadow-md shadow-blue-500/40">
                                        <FontAwesomeIcon icon={faChartLine} className="w-5 h-5"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 mb-1.5 w-11/12 rounded bg-blue-400"/>
                                        <div className="h-1.5 w-3/5 rounded bg-blue-300"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default HeroSection
