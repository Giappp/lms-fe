"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
    Upload, 
    FileSpreadsheet, 
    CheckCircle2, 
    XCircle, 
    AlertCircle,
    Download,
    ArrowLeft,
    FileText,
    HelpCircle,
    Loader2,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCourseCurriculum } from "@/hooks/useCourseCurriculum";
import { QuizService } from "@/api/services/quiz-service";
import { CourseService } from "@/api/services/course-service";
import { useToast } from "@/hooks/use-toast";

type ImportResult = {
    success: boolean;
    quizId?: number;
    questionsImported?: number;
    errors?: string[];
};

export default function QuizImportPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [courseId, setCourseId] = useState<number | undefined>(undefined);
    const [lessonId, setLessonId] = useState<number | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set());
    const [courses, setCourses] = useState<Array<{id: number; title: string}>>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    // Fetch curriculum when courseId changes
    const { chapters, isLoading: isCurriculumLoading } = useCourseCurriculum(courseId);

    // Load courses on mount
    React.useEffect(() => {
        const loadCourses = async () => {
            setIsLoadingCourses(true);
            try {
                const result = await CourseService.getMyCoursesDropdown();
                if (result?.success && result.data) {
                    setCourses(result.data);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load courses",
                    variant: "destructive"
                });
            } finally {
                setIsLoadingCourses(false);
            }
        };
        loadCourses();
    }, [toast]);

    const toggleChapter = (chapterId: string) => {
        setCollapsedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    const handleFileSelect = (file: File | null) => {
        if (!file) return;

        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (!validTypes.includes(file.type)) {
            alert("Please select a valid Excel file (.xlsx or .xls)");
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert("File size must be less than 10MB");
            return;
        }

        setSelectedFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileSelect(file);
    };

    const handleImport = async () => {
        if (!courseId) {
            toast({
                title: "Validation Error",
                description: "Please select a course",
                variant: "destructive"
            });
            return;
        }

        if (!selectedFile) {
            toast({
                title: "Validation Error",
                description: "Please select an Excel file to import",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);

        try {
            const result = await QuizService.importQuizFromExcel(selectedFile, courseId, lessonId);

            if (result?.success) {
                setImportResult({
                    success: true,
                    quizId: result.data?.quizId,
                    questionsImported: result.data?.questionsImported,
                    errors: result.data?.errors || []
                });
                setShowResultDialog(true);
                
                toast({
                    title: "Success",
                    description: `Quiz imported successfully with ${result.data?.questionsImported} questions`,
                });
            } else {
                throw new Error(result?.message || "Import failed");
            }
        } catch (error: any) {
            console.error("Import error:", error);
            setImportResult({
                success: false,
                errors: [error.message || "Failed to import quiz"]
            });
            setShowResultDialog(true);
            
            toast({
                title: "Import Failed",
                description: error.message || "An error occurred while importing the quiz",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleResultDialogClose = () => {
        setShowResultDialog(false);
        if (importResult?.success && importResult.quizId) {
            // Redirect to quiz detail page
            router.push(`/teacher/quizzes/${importResult.quizId}`);
        } else if (importResult?.success) {
            // Fallback to quiz list if no ID
            router.push("/teacher/quizzes");
        }
    };

    const downloadTemplate = () => {
        alert("Download template feature - Will trigger Excel template download");
        console.log("Downloading quiz import template...");
        // TODO: Implement actual template download
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push("/teacher/quizzes")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Quizzes
                </Button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Import Quiz from Excel</h1>
                        <p className="text-muted-foreground mt-1">
                            Upload an Excel file to import questions and create a quiz in bulk
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course and Lesson Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Details</CardTitle>
                            <CardDescription>Select where to import the quiz</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="course">Course *</Label>
                                <Select
                                    value={courseId?.toString()}
                                    onValueChange={(value) => {
                                        setCourseId(parseInt(value));
                                        setLessonId(undefined);
                                    }}
                                    disabled={isLoadingCourses}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select a course"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {courseId && (
                                <div className="space-y-3">
                                    <div>
                                        <Label>Lesson (Optional)</Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Select a lesson to create a lesson-level quiz, or leave empty for course-level
                                        </p>
                                    </div>
                                    
                                    {isCurriculumLoading ? (
                                        <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                            <p className="text-sm">Loading curriculum...</p>
                                        </div>
                                    ) : !chapters || chapters.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                            <p className="text-sm">No curriculum available for this course</p>
                                        </div>
                                    ) : (
                                        <RadioGroup
                                            value={lessonId?.toString() || "none"}
                                            onValueChange={(value) => setLessonId(value === "none" ? undefined : parseInt(value))}
                                        >
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-3">
                                                {/* None option for course-level quiz */}
                                                <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                                                    <RadioGroupItem value="none" id="lesson-none" />
                                                    <Label htmlFor="lesson-none" className="flex-1 cursor-pointer text-sm font-medium">
                                                        None (Course-level Quiz)
                                                    </Label>
                                                </div>
                                                
                                                <Separator className="my-2" />
                                                
                                                {chapters.map((chapter) => (
                                                    <div key={chapter.id} className="space-y-2">
                                                        {/* Chapter Header */}
                                                        <div
                                                            className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                                                            onClick={() => toggleChapter(chapter.id.toString())}
                                                        >
                                                            {collapsedChapters.has(chapter.id.toString()) ? (
                                                                <ChevronRight className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                            <span className="font-semibold text-sm">
                                                                {chapter.title}
                                                            </span>
                                                            <Badge variant="secondary" className="ml-auto">
                                                                {chapter.lessons.length} lessons
                                                            </Badge>
                                                        </div>

                                                        {/* Lessons */}
                                                        {!collapsedChapters.has(chapter.id.toString()) && (
                                                            <div className="ml-6 space-y-1">
                                                                {chapter.lessons.map((lesson) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50"
                                                                    >
                                                                        <RadioGroupItem
                                                                            value={lesson.id?.toString() || ""}
                                                                            id={`lesson-${lesson.id}`}
                                                                        />
                                                                        <Label
                                                                            htmlFor={`lesson-${lesson.id}`}
                                                                            className="flex-1 cursor-pointer text-sm font-normal"
                                                                        >
                                                                            {lesson.title}
                                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                                ({lesson.duration} min)
                                                                            </span>
                                                                        </Label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* File Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Excel File</CardTitle>
                            <CardDescription>
                                Drag and drop or click to select your Excel file
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Drag and Drop Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragging 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-muted rounded-full">
                                        <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    
                                    {selectedFile ? (
                                        <>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-sm">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedFile(null)}
                                            >
                                                Remove File
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <p className="font-semibold">
                                                    Drag and drop your Excel file here
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    or click to browse
                                                </p>
                                            </div>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept=".xlsx,.xls"
                                                onChange={handleFileInputChange}
                                                className="hidden"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Select File
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>File Requirements</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                                        <li>File type: .xlsx or .xls</li>
                                        <li>Maximum size: 10MB</li>
                                        <li>Must contain 2 sheets: Quiz Metadata and Questions</li>
                                        <li>Follow the template format exactly</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>

                            <Button 
                                onClick={handleImport} 
                                disabled={!selectedFile || !courseId || isUploading}
                                className="w-full gap-2"
                                size="lg"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Import Quiz
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start gap-2"
                                onClick={downloadTemplate}
                            >
                                <Download className="h-4 w-4" />
                                Download Template
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start gap-2"
                                onClick={() => window.open('/QUIZ_EXCEL_FORMAT_GUIDE.md', '_blank')}
                            >
                                <FileText className="h-4 w-4" />
                                View Format Guide
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Excel Format Guide */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="h-5 w-5" />
                                Format Guide
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold mb-2">Sheet 1: Quiz Metadata</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Title (Required)</li>
                                    <li>• Type: LESSON_QUIZ or COURSE_QUIZ</li>
                                    <li>• Time Limit, Passing %, etc.</li>
                                </ul>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Sheet 2: Questions</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Type | Text | Explanation | Points</li>
                                    <li>• QUESTION row for each question</li>
                                    <li>• ANSWER rows following each question</li>
                                    <li>• Mark correct answer as "true"</li>
                                </ul>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Common Errors</h4>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                    <li>• Missing required fields</li>
                                    <li>• Invalid quiz type</li>
                                    <li>• No correct answer marked</li>
                                    <li>• Incorrect data types</li>
                                </ul>
                            </div>
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    Each question must have at least one answer marked as correct
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    {/* Import Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Import Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Imports</span>
                                <Badge variant="secondary">12</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">This Month</span>
                                <Badge variant="secondary">5</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Success Rate</span>
                                <Badge className="bg-green-600">95%</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Result Dialog */}
            <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            {importResult?.success ? (
                                <div className="p-2 bg-green-100 dark:bg-green-950 rounded-full">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                            ) : (
                                <div className="p-2 bg-red-100 dark:bg-red-950 rounded-full">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                            )}
                            <AlertDialogTitle>
                                {importResult?.success ? "Import Successful!" : "Import Failed"}
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            {importResult?.success ? (
                                <div className="space-y-3">
                                    <p className="text-sm">
                                        Your quiz has been imported successfully.
                                    </p>
                                    <div className="bg-muted rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Quiz ID:</span>
                                            <span className="font-medium">#{importResult.quizId}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Questions Imported:</span>
                                            <span className="font-medium">{importResult.questionsImported}</span>
                                        </div>
                                    </div>
                                    {importResult.errors && importResult.errors.length > 0 && (
                                        <div className="bg-amber-500/10 rounded-lg p-4">
                                            <p className="text-sm font-medium mb-2 text-amber-700 dark:text-amber-400">Warnings:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {importResult.errors.map((error, index) => (
                                                    <li key={index} className="text-sm text-amber-600 dark:text-amber-300">{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-destructive">
                                        An error occurred while importing your quiz.
                                    </p>
                                    {importResult?.errors && importResult.errors.length > 0 && (
                                        <div className="bg-destructive/10 rounded-lg p-4">
                                            <p className="text-sm font-medium mb-2">Errors:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {importResult.errors.map((error, index) => (
                                                    <li key={index} className="text-sm text-destructive">{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleResultDialogClose}>
                            {importResult?.success ? "Go to Quizzes" : "Close"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
