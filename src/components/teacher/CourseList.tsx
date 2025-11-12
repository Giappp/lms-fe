'use client';

import React, {useMemo, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import CourseCard from './CourseCard';
import {CourseResponse} from '@/types';
import {CourseStatus} from '@/types/enum';
import {useCourses} from '@/hooks/useCourses';
import {useAuth} from '@/hooks/useAuth';
import CourseDetailsDrawer from './CourseDetailsDrawer';
import EditCourseModal from './EditCourseModal';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useDebounce} from '@/hooks/useDebounce';
import {Skeleton} from '@/components/ui/skeleton';

export default function CourseList() {
    const {user} = useAuth();
    const teacherId = user?.id;

    const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
    const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 300);

    const filters = useMemo(() => ({
        page: 1,
        size: 20,
        teacherId: teacherId,
        status: activeTab === 'published' ? CourseStatus.PUBLISHED : CourseStatus.DRAFT,
        q: debouncedKeyword || undefined,
    }), [teacherId, activeTab, debouncedKeyword]);

    const {courses, isLoading, mutate} = useCourses(filters as any);
    const refreshCourses = async () => await mutate();

    const handleView = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsViewOpen(true);
    };

    const handleEdit = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsEditOpen(true);
    };

    const onAfterSave = async () => {
        await refreshCourses();
        setIsEditOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Courses</h2>
                <div className="flex items-center gap-2">
                    <Input placeholder="Search courses..." value={keyword}
                           onChange={(e) => setKeyword(e.target.value)}/>
                    <Button onClick={() => refreshCourses()} variant="ghost">Refresh</Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
                <TabsList>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>

                <TabsContent value="published">
                    <div className="grid grid-cols-1 gap-3">
                        {isLoading ? (
                            // show 4 skeletons to indicate loading
                            Array.from({length: 4}).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-md"/>
                            ))
                        ) : courses.length === 0 ? (
                            <Card className="p-6 text-center">No courses found</Card>
                        ) : (
                            courses.map((c) => (
                                <CourseCard key={c.id} course={c} onView={handleView} onEdit={handleEdit}/>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="draft">
                    <div className="grid grid-cols-1 gap-3">
                        {isLoading ? (
                            Array.from({length: 4}).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-md"/>
                            ))
                        ) : courses.length === 0 ? (
                            <Card className="p-6 text-center">No draft courses</Card>
                        ) : (
                            courses.map((c) => (
                                <CourseCard key={c.id} course={c} onView={handleView} onEdit={handleEdit}/>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <CourseDetailsDrawer course={selectedCourse} open={isViewOpen} onOpenChange={setIsViewOpen}
                                 onEdit={handleEdit}/>
            <EditCourseModal course={selectedCourse} open={isEditOpen} onOpenChange={setIsEditOpen}
                             onSaved={onAfterSave}/>
        </div>
    );
}
