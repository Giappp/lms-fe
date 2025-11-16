import React, {Suspense} from 'react'
import CoursesBrowser from "@/components/student/courses/CoursesBrowser";
import CoursesBrowserSkeleton from "@/components/student/courses/CoursesBrowserSkeleton";

const Page = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center flex-wrap">
                <div className="mb-6">
                    <h1 className="md:text-3xl text-2xl">Courses to get you started</h1>
                    <p className="text-base text-secondary-foreground">
                        Explore courses from experienced, real-world experts.
                    </p>
                </div>
            </div>
            <Suspense fallback={<CoursesBrowserSkeleton/>}>
                <CoursesBrowser/>
            </Suspense>
        </div>
    )
}
export default Page
