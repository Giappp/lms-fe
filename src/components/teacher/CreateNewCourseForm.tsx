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
}

const steps: Step[] = [
    {id: 'template', title: 'Choose Template'},
    {id: 'basic-info', title: 'Basic Information'},
    {id: 'lessons', title: 'Lessons'},
    {id: 'review', title: 'Review & Publish'},
];

const CreateNewCourseForm = () => {
    const {user} = useAuth();
    const {createCourse, updateCourse} = useCourses();
    const [currentStep, setCurrentStep] = useState<StepId>('template');
    const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
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

    const markStepCompleted = (stepId: StepId) => {
        setCompletedSteps(prev => new Set(prev).add(stepId));
    };

    const isNextStepValid = (): boolean => {
        switch (currentStep) {
            case 'template':
                return !!courseData.template;
            case 'basic-info':
                return !!courseData.courseId;
            case 'lessons':
                return true;
            case 'review':
                return false;
            default:
                return true;
        }
    };

    const validateAndProceed = (): boolean => {
        switch (currentStep) {
            case 'template':
                if (!courseData.template) {
                    toast.error("Please select a template to proceed.");
                    return false;
                }
                return true;
            case 'basic-info':
                if (!courseData.courseId) {
                    toast.error("Please save the basic information to proceed.");
                    return false;
                }
                return true;
            case 'lessons':
                return true;
            case 'review':
                return false;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateAndProceed()) {
            return;
        }

        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex < steps.length - 1) {
            markStepCompleted(currentStep);
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
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(data)], {type: 'application/json'}));
        if (data.thumbnail) formData.append('thumbnail', data.thumbnail as File);

        try {
            let result = null;
            if (courseData.courseId) {
                result = await updateCourse(courseData.courseId, formData);
            } else {
                result = await createCourse(formData);
            }

            if (!result.success) {
                setBasicInfoErrors(result.errors || null);
                toast.error(result.message || 'Failed to save course');
                return;
            }

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
                // Mark basic-info as completed but don't auto-advance
                // Let user click Next button to proceed
                markStepCompleted('basic-info');
                toast.success('Course information saved successfully');
            }
        } catch (err) {
            console.error('Error saving basic info', err);
            toast.error('An unexpected error occurred while saving the course.');
        }
    }

    const isStepAccessible = (stepId: StepId): boolean => {
        const stepIndex = steps.findIndex(s => s.id === stepId);
        const currentIndex = steps.findIndex(s => s.id === currentStep);

        // Can access current step or any completed step
        if (stepId === currentStep) return true;
        if (completedSteps.has(stepId)) return true;

        // Can access previous steps
        return stepIndex < currentIndex;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">Follow the steps to create your course</p>
            </div>

            <Card className="p-6">
                <Tabs value={currentStep} onValueChange={(value) => {
                    if (isStepAccessible(value as StepId)) {
                        setCurrentStep(value as StepId);
                    }
                }} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        {steps.map((step) => (
                            <TabsTrigger
                                key={step.id}
                                value={step.id}
                                disabled={!isStepAccessible(step.id)}
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
                                markStepCompleted('template');
                                handleNext();
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="basic-info">
                        <BasicInfoForm
                            initialData={courseData.basicInfo}
                            serverErrors={basicInfoErrors}
                            onSaveAction={onSaveBasicInfo}
                        />
                    </TabsContent>

                    <TabsContent value="lessons">
                        <CurriculumBuilder
                            onSaveAction={(chapters) => {
                                setCourseData({...courseData, chapters});
                                markStepCompleted('lessons');
                                handleNext();
                            }}
                            courseId={courseData.courseId}
                        />
                    </TabsContent>

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
                        disabled={currentStep === 'review' || !isNextStepValid()}
                    >
                        Next
                    </Button>
                </div>
            </Card>
        </div>
    );
}
export default CreateNewCourseForm