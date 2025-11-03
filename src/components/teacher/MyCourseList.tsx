import React from 'react'
import useSWR from "swr";

const MyCourseList = () => {
    const {data,} = useSWR('/api/teacher/courses');
    return (
        <div>MyCourseList</div>
    )
}
export default MyCourseList
