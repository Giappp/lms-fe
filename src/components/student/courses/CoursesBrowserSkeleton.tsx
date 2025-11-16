import React from 'react'
import {Skeleton} from "@/components/ui/skeleton"

const CoursesBrowserSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Filter Skeletons */}
            <div className="space-y-4">
                <Skeleton className="w-[480px] h-10 rounded-lg"/>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Skeleton className="h-10 rounded-lg"/>
                    <Skeleton className="h-10 rounded-lg"/>
                    <Skeleton className="h-10 rounded-lg"/>
                </div>
            </div>

            {/* Course Cards Skeleton */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({length: 8}).map((_, index) => (
                    <div key={index} className="space-y-3">
                        <Skeleton className="h-[180px] w-full rounded-lg"/>
                        <Skeleton className="h-4 w-3/4"/>
                        <Skeleton className="h-4 w-1/2"/>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4"/>
                            <Skeleton className="h-4 w-full"/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CoursesBrowserSkeleton