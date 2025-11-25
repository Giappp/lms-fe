import React, {Suspense} from 'react'
import CoursesBrowserSkeleton from "@/components/student/courses/CoursesBrowserSkeleton";
import CourseSearchPage from "@/components/student/courses/CourseSearchPage";

const Page = () => {
    return (
        <Suspense fallback={<CoursesBrowserSkeleton/>}>
            <CourseSearchPage/>
        </Suspense>
    )
}
export default Page
