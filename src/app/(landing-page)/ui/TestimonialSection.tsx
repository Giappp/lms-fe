import React from 'react'
import Image from "next/image";

const TestimonialSection = () => {
    return (
        <section className="testimonials">
            <div className="testimonials-content">
                <div className="section-header">
                    <h2 data-translate="landing.testimonials.title">What Our Users Say</h2>
                    <p data-translate="landing.testimonials.subtitle">
                        Real stories from educators and learners who love our platform
                    </p>
                </div>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-quote">
                            <i className="fas fa-quote-left"></i>
                        </div>
                        <p className="testimonial-text" data-translate="landing.testimonials.quote1">
                            &#34;EduLearn LMS has completely transformed how I teach online. The interactive features
                            keep
                            my students engaged and the analytics help me track their progress effectively.&#34;
                        </p>
                        <div className="testimonial-author">
                            <Image src="/ui-avatars.svg"
                                   alt="Sarah Johnson" className="testimonial-avatar" width={50} height={50}/>
                            <div>
                                <div className="testimonial-name">Sarah Johnson</div>
                                <div className="testimonial-role"
                                     data-translate="landing.testimonials.role1">Mathematics Teacher
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-quote">
                            <i className="fas fa-quote-left"></i>
                        </div>
                        <p className="testimonial-text" data-translate="landing.testimonials.quote2">
                            &#34;As a student, I love how easy it is to access my courses and track my progress. The
                            quiz
                            system is fantastic and helps me prepare for exams efficiently.&#34;
                        </p>
                        <div className="testimonial-author">
                            <Image src="/ui-avatars.png"
                                   alt="Mike Chen" className="testimonial-avatar" width={50} height={50}/>
                            <div>
                                <div className="testimonial-name">Mike Chen</div>
                                <div className="testimonial-role" data-translate="landing.testimonials.role2">Computer
                                    Science Student
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-quote">
                            <i className="fas fa-quote-left"></i>
                        </div>
                        <p className="testimonial-text" data-translate="landing.testimonials.quote3">
                            &#34;Managing our institution&#39;s learning programs has never been easier. The admin
                            dashboard
                            provides all the insights we need to make data-driven decisions.&#34;
                        </p>
                        <div className="testimonial-author">
                            <Image src="/ui-avatars-3.svg"
                                   alt="Emily Davis" className="testimonial-avatar" width={50} height={50}/>
                            <div>
                                <div className="testimonial-name">Emily Davis</div>
                                <div className="testimonial-role" data-translate="landing.testimonials.role3">School
                                    Administrator
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default TestimonialSection
