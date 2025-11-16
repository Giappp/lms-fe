'use client'
import React, {useEffect, useRef} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faChalkboardTeacher, faSmile, faUserGraduate} from "@fortawesome/free-solid-svg-icons";

interface StatCounterProps {
    target: number;
    durations?: number;
}

function StatCounter({target, durations = 2000}: StatCounterProps) {
    const counterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const counter = counterRef.current;
        if (!counter) return;


        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = target / (durations / 16);


                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.ceil(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                if (target === 98) {
                                    counter.textContent = target + "%";
                                } else {
                                    counter.textContent = target.toLocaleString();
                                }
                            }
                        };


                        updateCounter();
                        observer.unobserve(counter);
                    }
                });
            },
            {threshold: 0.5}
        );


        observer.observe(counter);


        return () => observer.disconnect();
    }, [target, durations]);


    return (
        <div
            ref={counterRef}
            className="stat-number text-3xl font-bold"
        >0</div>
    );
}

const StatsSection = () => {
    return (
        <section className="stats">
            <div className="stats-content">
                <div className="section-header">
                    <h2 data-translate="landing.stats.title">Trusted by Thousands Worldwide</h2>
                    <p data-translate="landing.stats.subtitle">
                        Join educators and students who are transforming education with our platform
                    </p>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <StatCounter target={50000}/>
                        <div className="stat-label" data-translate="landing.stats.students">Active Students</div>
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faUserGraduate}/>
                        </div>
                    </div>
                    <div className="stat-card">
                        <StatCounter target={2500}/>
                        <div className="stat-label" data-translate="landing.stats.teachers">Expert Teachers</div>
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faChalkboardTeacher}/>
                        </div>
                    </div>
                    <div className="stat-card">
                        <StatCounter target={10000}/>
                        <div className="stat-label" data-translate="landing.stats.courses">Courses Created</div>
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faBook}/>
                        </div>
                    </div>
                    <div className="stat-card">
                        <StatCounter target={98}/>
                        <div className="stat-label" data-translate="landing.stats.satisfaction">% Satisfaction Rate
                        </div>
                        <div className="stat-icon">
                            <i className="fas fa-smile"></i>
                            <FontAwesomeIcon icon={faSmile}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default StatsSection
