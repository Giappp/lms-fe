import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChalkboardUser,
    faChartLine,
    faMobileAlt,
    faPuzzlePiece,
    faShieldAlt,
    faUsers
} from "@fortawesome/free-solid-svg-icons";

const FeaturesSection = () => {
    return (
        <section id="features" className="features">
            <div className="section-header">
                <h2 data-translate="landing.features.title">Everything You Need to Succeed</h2>
                <p data-translate="landing.features.subtitle">
                    Powerful features designed to enhance teaching and learning experiences for modern education.
                </p>
            </div>
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faChalkboardUser}/>
                    </div>
                    <h3 data-translate="landing.features.teaching.title">Interactive Teaching</h3>
                    <p data-translate="landing.features.teaching.desc">
                        Create engaging lessons with multimedia content, quizzes, and interactive assessments.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faChartLine}/>
                    </div>
                    <h3 data-translate="landing.features.analytics.title">Advanced Analytics</h3>
                    <p data-translate="landing.features.analytics.desc">
                        Track student progress with detailed analytics and generate comprehensive reports.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faMobileAlt}/>
                    </div>
                    <h3 data-translate="landing.features.mobile.title">Mobile Ready</h3>
                    <p data-translate="landing.features.mobile.desc">
                        Access your courses anywhere, anytime with our fully responsive design.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faUsers}/>
                    </div>
                    <h3 data-translate="landing.features.collaboration.title">Collaboration</h3>
                    <p data-translate="landing.features.collaboration.desc">
                        Foster collaboration with discussion forums, group projects, and peer reviews.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faShieldAlt}/>
                    </div>
                    <h3 data-translate="landing.features.security.title">Secure & Reliable</h3>
                    <p data-translate="landing.features.security.desc">
                        Enterprise-grade security with regular backups and 99.9% uptime guarantee.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faPuzzlePiece}/>
                    </div>
                    <h3 data-translate="landing.features.integration.title">Easy Integration</h3>
                    <p data-translate="landing.features.integration.desc">
                        Integrate with your existing tools and systems with our comprehensive API.
                    </p>
                </div>
            </div>
        </section>
    )
}
export default FeaturesSection
