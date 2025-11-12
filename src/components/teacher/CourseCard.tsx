'use client';

import React from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {CourseResponse} from "@/types";

export interface CourseCardProps {
    course: CourseResponse;
    onView: (course: CourseResponse) => void;
    onEdit: (course: CourseResponse) => void;
}

export default function CourseCard({course, onView, onEdit}: CourseCardProps) {
    return (
        <Card className="p-4 flex gap-4 items-center">
            <div className="relative flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                {course.thumbnailUrl ? (
                    // using next/image for optimization
                    <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full"/>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{course.title}</h3>
                <p className="text-xs text-muted-foreground truncate mt-1">{course.description}</p>

                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="capitalize">{course.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">${course.price}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-muted-foreground">{course.teacherName}</div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(course)}>View</Button>
                    <Button size="sm" onClick={() => onEdit(course)}>Edit</Button>
                </div>
            </div>
        </Card>
    );
}

