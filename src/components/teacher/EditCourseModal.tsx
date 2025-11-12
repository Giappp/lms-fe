'use client';

import React, {useEffect, useState} from 'react';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import BasicInfoForm from './BasicInfoForm';
import LessonEditor from './LessonEditor';
import {CourseResponse} from '@/types/response';
import {CourseCreationRequest} from '@/types/request';
import {CourseService} from '@/api/services/course-service';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ChapterWithLessons} from '@/types/types';

export interface EditCourseModalProps {
    course: CourseResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: () => void;
}

export default function EditCourseModal({course, open, onOpenChange, onSaved}: EditCourseModalProps) {
    const [serverErrors, setServerErrors] = useState<Record<string, string> | null>(null);
    const [activeTab, setActiveTab] = useState<'basic' | 'curriculum'>('basic');
    const [chapters, setChapters] = useState<ChapterWithLessons[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setServerErrors(null);
            setActiveTab('basic');
            setChapters(undefined);
        }
    }, [open]);

    // When modal opens and a course is provided, try to fetch fresh course detail (which may include curriculum)
    useEffect(() => {
        const load = async () => {
            if (!open || !course) return;
            setLoading(true);
            try {
                const res = await CourseService.getCourseById(course.id);
                if ((res as any)?.success) {
                    const data = (res as any).data;
                    // Try possible property names where backend might return chapters/curriculum
                    const found = (data && (data.chapters || data.curriculum || data.courseStructure));
                    if (found && Array.isArray(found)) {
                        setChapters(found as ChapterWithLessons[]);
                    } else {
                        // no chapters available — leave undefined so editor will show empty state
                        setChapters([]);
                    }
                } else {
                    // api returned error; surface message
                    setServerErrors(res.errors || (res.message ? {general: res.message} : {general: 'Failed to load course'}));
                }
            } catch (err: any) {
                setServerErrors({general: 'Failed to load course details'});
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, course]);

    const mapCourseToInitial = (c?: CourseResponse | null): Partial<CourseCreationRequest> | null => {
        if (!c) return null;
        return {
            title: c.title,
            description: c.description,
            difficulty: c.difficulty,
            price: c.price,
            teacherId: c.teacherId,
            teacherName: c.teacherName,
            status: c.status,
            thumbnailUrl: (c as any).thumbnailUrl || (c as any).thumbnail || '',
            // The Course type doesn't include category IDs; leave empty so form won't try to submit invalid ids
            categoryId: []
        };
    };

    const handleSaveBasic = async (data: CourseCreationRequest) => {
        if (!course) return;
        setServerErrors(null);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('difficulty', data.difficulty);
            formData.append('price', String(data.price));
            formData.append('status', data.status);
            if (data.thumbnail) {
                formData.append('thumbnail', data.thumbnail);
            }
            // append categories if present
            if (data.categoryId && data.categoryId.length > 0) {
                data.categoryId.forEach(id => formData.append('categoryId', String(id)));
            }

            const res = await CourseService.updateCourseBasicInfo(course.id, formData);
            if ((res as any)?.success) {
                onSaved?.();
                onOpenChange(false);
            } else {
                setServerErrors((res as any).errors || ((res as any).message ? {general: (res as any).message} : {general: 'Failed to update course'}));
            }
        } catch (err: any) {
            const payload = err?.response?.data;
            if (payload?.errors) {
                const errorsMap: Record<string, string> = {};
                Object.entries(payload.errors).forEach(([k, v]: any) => {
                    errorsMap[k] = Array.isArray(v) ? v.join(' ') : String(v);
                });
                setServerErrors(errorsMap);
            } else if (payload?.message) {
                setServerErrors({general: payload.message});
            } else {
                setServerErrors({general: 'Failed to update course'});
            }
        }
    };

    const handleSaveCurriculum = async (items: ChapterWithLessons[]) => {
        if (!course) return;
        setServerErrors(null);
        try {
            const payload = {chapters: items};
            const res = await CourseService.updateCourseCurriculum(course.id, payload);
            if ((res as any)?.success) {
                onSaved?.();
                onOpenChange(false);
            } else {
                setServerErrors((res as any).errors || ((res as any).message ? {general: (res as any).message} : {general: 'Failed to save curriculum'}));
            }
        } catch (err: any) {
            const payload = err?.response?.data;
            if (payload?.errors) {
                const errorsMap: Record<string, string> = {};
                Object.entries(payload.errors).forEach(([k, v]: any) => {
                    errorsMap[k] = Array.isArray(v) ? v.join(' ') : String(v);
                });
                setServerErrors(errorsMap);
            } else if (payload?.message) {
                setServerErrors({general: payload.message});
            } else {
                setServerErrors({general: 'Failed to save curriculum'});
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>

                <div className="p-2">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="basic">Basic Information</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic">
                            <BasicInfoForm initialData={mapCourseToInitial(course)} onSaveAction={handleSaveBasic}
                                           serverErrors={serverErrors}/>
                        </TabsContent>

                        <TabsContent value="curriculum">
                            {/* loading state handled inside LessonEditor; pass initial chapters when available */}
                            <LessonEditor
                                initial={chapters}
                                onSaveAction={(items) => handleSaveCurriculum(items)}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter>
                    <DialogClose></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
