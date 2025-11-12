'use client';

import React from 'react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {CourseResponse} from "@/types";

export interface CourseDetailsDrawerProps {
    course: CourseResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (course: CourseResponse) => void;
}

export default function CourseDetailsDrawer({course, open, onOpenChange, onEdit}: CourseDetailsDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>{course?.title || 'Course details'}</SheetTitle>
                    <SheetDescription>{course?.description}</SheetDescription>
                </SheetHeader>

                <div className="p-4 space-y-4">
                    {course?.thumbnailUrl ? (
                        <div className="relative rounded-md overflow-hidden bg-gray-100">
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-auto object-cover"/>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Instructor</h4>
                            <div className="text-sm">{course?.teacherName}</div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                            <div className="text-sm">${course?.price}</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Difficulty</h4>
                        <div className="text-sm capitalize">{course?.difficulty?.toString().toLowerCase()}</div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                        <div className="text-sm">{course?.status}</div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
                        <div className="text-sm flex gap-2 flex-wrap">
                            {course?.categories?.map((c) => (
                                <span key={c.name} className="text-xs px-2 py-1 rounded bg-muted">{c.name}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <div className="w-full flex justify-end gap-2">
                        {course && (
                            <Button variant="outline" onClick={() => onEdit?.(course)}>Edit</Button>
                        )}
                        <SheetClose>
                            <Button>Close</Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

