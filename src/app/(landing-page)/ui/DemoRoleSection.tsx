'use client'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChalkboardTeacher,
    faCheck,
    faPlay,
    faSignInAlt,
    faUserCheck,
    faUserGraduate
} from "@fortawesome/free-solid-svg-icons";

const DemoRoleSection = () => {
    const playDemo = (event: MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();
        alert('Demo video would play here. In a real implementation, this would open a video player.');
    }
    return (
        <>
            <section id="demo" className="demo">
                <div className="demo-content">
                    <div className="section-header">
                        <h2 data-translate="landing.demo.title">See It In Action</h2>
                        <p data-translate="landing.demo.subtitle">
                            Watch how EduLearn LMS transforms traditional learning into an engaging digital experience.
                        </p>
                    </div>
                    <div className="demo-video">
                        <div className="demo-placeholder" onClick={playDemo}>
                            <FontAwesomeIcon icon={faPlay}/>
                        </div>
                    </div>
                    <p data-translate="landing.demo.description">
                        Discover how teachers create courses, students engage with content, and administrators manage
                        the entire learning ecosystem.
                    </p>
                </div>
            </section>
            <section id="roles" className="roles">
                <div className="section-header">
                    <h2 data-translate="landing.roles.title">Choose Your Experience</h2>
                    <p data-translate="landing.roles.subtitle">
                        Start your journey with the role that best fits your needs. You can always upgrade or change
                        later.
                    </p>
                </div>
                <div className="roles-grid">
                    <div className="role-card student">
                        <div className="role-icon">
                            <FontAwesomeIcon icon={faUserGraduate}/>
                        </div>
                        <h3 data-translate="landing.roles.student.title">Student</h3>
                        <p data-translate="landing.roles.student.desc">
                            Access courses, track progress, take quizzes, and collaborate with peers.
                        </p>
                        <ul className="role-features">
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.student.feature1">Access all courses</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.student.feature2">Track learning progress</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.student.feature3">Take interactive quizzes</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.student.feature4">Download certificates</span>
                            </li>
                        </ul>
                        <Link href="/signup/student" className="btn btn--large role-btn-student w-full">
                            <FontAwesomeIcon icon={faSignInAlt} className="mr-[8px]"></FontAwesomeIcon>
                            <span data-translate="landing.roles.student.login">Start Learning</span>
                        </Link>
                    </div>
                    <div className="role-card teacher">
                        <div className="role-icon">
                            <FontAwesomeIcon icon={faChalkboardTeacher}/>
                        </div>
                        <h3 data-translate="landing.roles.teacher.title">Teacher</h3>
                        <p data-translate="landing.roles.teacher.desc">
                            Create courses, manage students, design quizzes, and track className performance.
                        </p>
                        <ul className="role-features">
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.teacher.feature1">Create unlimited courses</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.teacher.feature2">Build interactive quizzes</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.teacher.feature3">Monitor student progress</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.teacher.feature4">Generate reports</span>
                            </li>
                        </ul>
                        <Link href="/signup/teacher" className="btn btn--large role-btn-teacher w-full">
                            <FontAwesomeIcon icon={faSignInAlt} className="mr-[8px]"></FontAwesomeIcon>
                            <span data-translate="landing.roles.teacher.login">Start Teaching</span>
                        </Link>
                    </div>
                    <div className="role-card admin">
                        <div className="role-icon">
                            <FontAwesomeIcon icon={faUserCheck}/>
                        </div>
                        <h3 data-translate="landing.roles.admin.title">Administrator</h3>
                        <p data-translate="landing.roles.admin.desc">
                            Manage the entire system, users, courses, and get comprehensive analytics.
                        </p>
                        <ul className="role-features">
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.admin.feature1">User management</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.admin.feature2">System analytics</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.admin.feature3">Content oversight</span>
                            </li>
                            <li><FontAwesomeIcon icon={faCheck}/> <span data-translate="landing.roles.admin.feature4">Advanced reporting</span>
                            </li>
                        </ul>
                        <Link href="pages/login-admin.html" className="btn btn--large role-btn-admin w-full">
                            <FontAwesomeIcon icon={faSignInAlt} className="mr-[8px]"></FontAwesomeIcon>
                            <span data-translate="landing.roles.admin.login">Manage System</span>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
export default DemoRoleSection
