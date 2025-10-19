'use client'
import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const PricingSection = () => {
    return (
        <section id="pricing" className="pricing">
            <div className="pricing-content">
                <div className="section-header">
                    <h2 data-translate="landing.pricing.title">Simple, Transparent Pricing</h2>
                    <p data-translate="landing.pricing.subtitle">
                        Choose the perfect plan for your learning journey
                    </p>
                </div>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <div className="pricing-header">
                            <h3 data-translate="landing.pricing.free.title">Free</h3>
                            <div className="pricing-price">
                                <span className="currency">$</span>
                                <span className="amount">0</span>
                                <span className="period" data-translate="landing.pricing.perMonth">/month</span>
                            </div>
                            <p className="pricing-desc" data-translate="landing.pricing.free.desc">Perfect for
                                individual learners</p>
                        </div>
                        <ul className="pricing-features">
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.free.feature1">Access to 10 courses</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.free.feature2">Basic quizzes</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.free.feature3">Progress tracking</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.free.feature4">Email support</span>
                            </li>
                            <li className="disabled"><FontAwesomeIcon icon={faTimes}/><span
                                data-translate="landing.pricing.free.disabled1">Advanced analytics</span></li>
                            <li className="disabled"><FontAwesomeIcon icon={faTimes}/><span
                                data-translate="landing.pricing.free.disabled2">Priority support</span></li>
                        </ul>
                        <Link href="#roles" className={"btn btn-secondary btn-large btn-block"}
                              data-translate="landing.pricing.getStarted">Get Started</Link>
                    </div>
                    <div className="pricing-card featured">
                        <div className="pricing-badge" data-translate="landing.pricing.popular">Most Popular</div>
                        <div className="pricing-header">
                            <h3 data-translate="landing.pricing.pro.title">Professional</h3>
                            <div className="pricing-price">
                                <span className="currency">$</span>
                                <span className="amount">29</span>
                                <span className="period" data-translate="landing.pricing.perMonth">/month</span>
                            </div>
                            <p className="pricing-desc" data-translate="landing.pricing.pro.desc">For teachers and small
                                institutions</p>
                        </div>
                        <ul className="pricing-features">
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.pro.feature1">Unlimited courses</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.pro.feature2">Advanced quiz builder</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.pro.feature3">Student analytics</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.pro.feature4">Custom certificates</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.pro.feature5">Priority support</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.pricing.pro.feature6">API access</span>
                            </li>
                        </ul>
                        <Link href="#roles" className="btn btn-primary btn-large btn-block"
                              data-translate="landing.pricing.getStarted">Get Started</Link>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-header">
                            <h3 data-translate="landing.pricing.enterprise.title">Enterprise</h3>
                            <div className="pricing-price">
                                <span className="currency">$</span>
                                <span className="amount">99</span>
                                <span className="period" data-translate="landing.pricing.perMonth">/month</span>
                            </div>
                            <p className="pricing-desc" data-translate="landing.pricing.enterprise.desc">For large
                                organizations</p>
                        </div>
                        <ul className="pricing-features">
                            <li><FontAwesomeIcon icon={faCheck}/> <span
                                data-translate="landing.pricing.enterprise.feature1">Everything in Pro</span></li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span
                                data-translate="landing.pricing.enterprise.feature2">White labeling</span></li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span
                                data-translate="landing.pricing.enterprise.feature3">Custom integrations</span></li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span
                                data-translate="landing.pricing.enterprise.feature4">Dedicated support</span></li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span
                                data-translate="landing.pricing.enterprise.feature5">SLA guarantee</span></li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span
                                data-translate="landing.pricing.enterprise.feature6">On-premise option</span></li>
                        </ul>
                        <Link href="#contact" className="btn btn-secondary btn-large btn-block"
                              data-translate="landing.pricing.contactSales">Contact Sales</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default PricingSection
