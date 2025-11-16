"use client"
import React, {useState} from 'react'
import {CourseFormData} from "@/types/types";
import {Card} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TemplateChooser from "@/components/teacher/TemplateChooser";
import BasicInfoForm from "@/components/teacher/BasicInfoForm";
import CurriculumBuilder from "@/components/teacher/CurriculumBuilder";
import ReviewPublish from "@/components/teacher/ReviewPublish";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/hooks/useAuth";
import {CourseStatus} from "@/types/enum";
import {CourseResponse} from '@/types';
import {CourseCreationRequest} from '@/types/request';
import {toast} from "sonner";
import {useCourses} from "@/hooks/useCourses";

type StepId = 'template' | 'basic-info' | 'lessons' | 'review';

type Step = {
    id: StepId;
    title: string;
    touched: boolean;
}

const steps: Step[] = [
    {id: 'template', title: 'Choose Template', touched: false},
    {id: 'basic-info', title: 'Basic Information', touched: false},
    {id: 'lessons', title: 'Lessons', touched: false},
    {id: 'review', title: 'Review & Publish', touched: false},
];

const CreateNewCourseForm = () => {
    const {user} = useAuth();
    const {createCourse, updateCourse, isError} = useCourses();
    const [currentStep, setCurrentStep] = useState<StepId>('template');
    const [basicInfoErrors, setBasicInfoErrors] = useState<Record<string, string> | null>(null);
    const [courseData, setCourseData] = useState<CourseFormData>({
        template: null,
        basicInfo: {
            teacherId: user?.id,
            teacherName: user?.fullName,
            status: CourseStatus.DRAFT,
            submitted: false,
        },
        courseId: undefined,
        chapters: [],
    });

    const handleNext = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (!courseData.courseId && currentIndex === 1) {
            setBasicInfoErrors({general: "Please fill all the form to proceed."});
            return toast.error("Please fill all the form to proceed.");
        }
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id);
        }
    };

    const handleBack = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
        }
    };

    const onSaveBasicInfo = async (data: CourseCreationRequest) => {
        // Build FormData and call create/update via CourseService
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(data)], {type: 'application/json'}));
        if (data.thumbnail) formData.append('thumbnail', data.thumbnail as File);

        // Decide if updating existing course or creating new
        try {
            let result = null;
            if (courseData.courseId) {
                result = await updateCourse(courseData.courseId, formData);
            } else {
                result = await createCourse(formData);
            }

            if (!result.success) {
                // surface server validation errors back to BasicInfoForm
                setBasicInfoErrors(result.errors || null);
                toast.error(result.message || 'Failed to save course');
                return;
            }

            // clear previous validation errors on success
            setBasicInfoErrors(null);

            const saved = result.data as CourseResponse | undefined;
            if (saved) {
                setCourseData({
                    ...courseData,
                    basicInfo: {
                        ...saved,
                        submitted: true,
                    } as any,
                    courseId: saved.id,
                });
                handleNext();
            }
        } catch (err) {
            console.error('Error saving basic info', err);
            toast.error('An unexpected error occurred while saving the course.');
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">Follow the steps to create your course</p>
            </div>

            <Card className="p-6">
                <Tabs value={currentStep} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        {steps.map((step) => (
                            <TabsTrigger
                                key={step.id}
                                value={step.id}
                                disabled={step.touched}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {step.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="template">
                        <TemplateChooser
                            onSelect={(template) => {
                                setCourseData({...courseData, template});
                                handleNext();
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="basic-info">
                        <BasicInfoForm
                            initialData={courseData.basicInfo}
                            serverErrors={basicInfoErrors}
                            onSaveAction={(response) => {
                                onSaveBasicInfo(response).then(r => handleNext());
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="lessons">
                        <CurriculumBuilder
                            onSaveAction={(chapters) => {
                                setCourseData({...courseData, chapters});
                                handleNext();
                            }}
                            courseId={courseData.courseId}
                        />
                    </TabsContent>

                    {/*<TabsContent value="materials">*/}
                    {/*    <MaterialsEditor*/}
                    {/*        materials={courseData.materials}*/}
                    {/*        onSaveAction={(materials) => {*/}
                    {/*            setCourseData({...courseData, materials});*/}
                    {/*            handleNext();*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</TabsContent>*/}

                    <TabsContent value="review">
                        <ReviewPublish courseData={courseData}/>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 'template'}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={currentStep === 'review'}
                    >
                        Next
                    </Button>
                </div>
            </Card>
        </div>
    );
}
export default CreateNewCourseForm
