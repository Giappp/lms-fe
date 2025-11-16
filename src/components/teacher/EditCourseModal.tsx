'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import BasicInfoForm from './BasicInfoForm';
import CurriculumBuilder from './CurriculumBuilder';
import {CourseResponse} from '@/types/response';
import {CourseCreationRequest} from '@/types/request';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useCourses} from "@/hooks/useCourses";
import {Alert, AlertDescription} from "@/components/ui/alert";

export interface EditCourseModalProps {
    course: CourseResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: () => void;
}

type TabValue = 'basic' | 'curriculum';

export default function EditCourseModal({course, open, onOpenChange, onSaved}: EditCourseModalProps) {
    const [serverErrors, setServerErrors] = useState<Record<string, string> | null>(null);
    const [activeTab, setActiveTab] = useState<TabValue>('basic');
    const [saving, setSaving] = useState(false);

    // Use SWR hooks for data fetching
    const {updateCourse} = useCourses();

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setServerErrors(null);
            setActiveTab('basic');
            setSaving(false);
        }
    }, [open]);

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
            categoryId: []
        };
    };

    const handleApiError = useCallback((error: any, defaultMessage: string) => {
        const payload = error?.response?.data;

        if (payload?.errors) {
            const errorsMap: Record<string, string> = {};
            Object.entries(payload.errors).forEach(([key, value]: [string, any]) => {
                errorsMap[key] = Array.isArray(value) ? value.join(' ') : String(value);
            });
            setServerErrors(errorsMap);
        } else if (payload?.message) {
            setServerErrors({general: payload.message});
        } else if (error?.message) {
            setServerErrors({general: error.message});
        } else {
            setServerErrors({general: defaultMessage});
        }
    }, []);

    // Save basic course information
    const handleSaveBasic = useCallback(async (data: CourseCreationRequest) => {
        if (!course) return;

        setServerErrors(null);
        setSaving(true);

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

            if (data.categoryId && data.categoryId.length > 0) {
                data.categoryId.forEach(id => formData.append('categoryId', String(id)));
            }

            const result = await updateCourse(course.id, formData);

            if (result?.success) {
                onSaved?.();
                onOpenChange(false);
            } else {
                const errorMsg = result?.message || 'Failed to update course';
                setServerErrors(result?.errors as Record<string, string> || {general: errorMsg});
            }
        } catch (error) {
            handleApiError(error, 'Failed to update course');
        } finally {
            setSaving(false);
        }
    }, [course, updateCourse, onSaved, onOpenChange, handleApiError]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>

                {serverErrors?.general && (
                    <Alert variant="destructive">
                        <AlertDescription>{serverErrors.general}</AlertDescription>
                    </Alert>
                )}

                <div className="p-2">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="basic" disabled={saving}>
                                Basic Information
                            </TabsTrigger>
                            <TabsTrigger value="curriculum" disabled={saving}>
                                Curriculum
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic">
                            <BasicInfoForm
                                initialData={mapCourseToInitial(course)}
                                onSaveAction={handleSaveBasic}
                                serverErrors={serverErrors}
                                disabled={saving}
                            />
                        </TabsContent>

                        <TabsContent value="curriculum">
                            <CurriculumBuilder
                                disabled={saving}
                                courseId={course?.id}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter>
                    <DialogClose disabled={saving}>
                        {saving ? 'Saving...' : 'Close'}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
