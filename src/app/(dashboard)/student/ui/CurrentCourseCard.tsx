import React from 'react'
import Image from "next/image";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";

type CurrentCourseCardProps = {
    imageUrl: string
    name: string
    instructor: string
    lesson: string
    progress: number
}

const CurrentCourseCard: React.FC<CurrentCourseCardProps> = ({imageUrl, name, instructor, lesson, progress}) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded mb-3">
            {imageUrl && (
                <Image src={imageUrl} width={60} height={60} alt={name}/>
            )}
            <div className="flex-1">
                <h4>{name}</h4>
                <p>Instructor: {instructor}</p>
                <div className="my-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-secondary-foreground text-sm">Next Lesson: {lesson}</span>
                        <span className="text-secondary-foreground text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress}/>
                </div>
            </div>
            <Button size={"sm"}>Continue</Button>
        </div>
    )
}
export default CurrentCourseCard
