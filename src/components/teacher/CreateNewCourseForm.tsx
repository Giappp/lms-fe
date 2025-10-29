"use client"
import React, {useState} from 'react'
import {CourseFormData} from "@/app/(dashboard)/teacher/courses/new/types";
import {Card} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TemplateChooser from "@/components/teacher/TemplateChooser";
import BasicInfoForm from "@/components/teacher/BasicInfoForm";
import LessonEditor from "@/components/teacher/LessonEditor";
import MaterialsEditor from "@/components/teacher/MaterialsEditor";
import ReviewPublish from "@/components/teacher/ReviewPublish";
import {Button} from "@/components/ui/button";

type StepId = 'template' | 'basic-info' | 'lessons' | 'materials' | 'review';

type Step = {
    id: StepId;
    title: string;
}

const steps: Step[] = [
    {id: 'template', title: 'Choose Template'},
    {id: 'basic-info', title: 'Basic Information'},
    {id: 'lessons', title: 'Lessons'},
    {id: 'materials', title: 'Materials'},
    {id: 'review', title: 'Review & Publish'},
];

const CreateNewCourseForm = () => {
    const [currentStep, setCurrentStep] = useState<StepId>('template');
    const [courseData, setCourseData] = useState<CourseFormData>({
        template: null,
        basicInfo: null,
        chapters: [],
        materials: [],
    });

    const handleNext = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep);
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

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">Follow the steps to create your course</p>
            </div>

            <Card className="p-6">
                <Tabs value={currentStep} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        {steps.map((step) => (
                            <TabsTrigger
                                key={step.id}
                                value={step.id}
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
                            onSaveAction={(basicInfo) => {
                                setCourseData({...courseData, basicInfo});
                                handleNext();
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="lessons">
                        <LessonEditor
                            lessons={courseData.chapters}
                            onSaveAction={(chapters) => {
                                setCourseData({...courseData, chapters});
                                handleNext();
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="materials">
                        <MaterialsEditor
                            materials={courseData.materials}
                            onSaveAction={(materials) => {
                                setCourseData({...courseData, materials});
                                handleNext();
                            }}
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
