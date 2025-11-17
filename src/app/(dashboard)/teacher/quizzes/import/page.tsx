"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
    Upload, 
    FileSpreadsheet, 
    CheckCircle2, 
    XCircle, 
    AlertCircle,
    Download,
    ArrowLeft,
    FileText,
    HelpCircle
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

// Mock courses data
const mockCourses = [
    { id: 1, title: "React Fundamentals", lessons: 8 },
    { id: 2, title: "Advanced JavaScript", lessons: 6 },
    { id: 3, title: "TypeScript Basics", lessons: 5 },
    { id: 4, title: "Node.js Backend Development", lessons: 10 },
    { id: 5, title: "Full Stack Web Development", lessons: 12 }
];

// Mock lessons data
const mockLessons: Record<number, Array<{ id: number; title: string; chapterTitle: string }>> = {
    1: [
        { id: 1, title: "Introduction to React", chapterTitle: "Getting Started" },
        { id: 2, title: "Setting up Development Environment", chapterTitle: "Getting Started" },
        { id: 3, title: "Your First React Component", chapterTitle: "Getting Started" },
        { id: 4, title: "useState and useEffect", chapterTitle: "React Hooks" },
        { id: 5, title: "useContext and useReducer", chapterTitle: "React Hooks" },
        { id: 6, title: "Custom Hooks", chapterTitle: "React Hooks" },
        { id: 7, title: "Higher Order Components", chapterTitle: "Advanced Patterns" },
        { id: 8, title: "Render Props", chapterTitle: "Advanced Patterns" }
    ],
    2: [
        { id: 9, title: "Arrow Functions", chapterTitle: "ES6+ Features" },
        { id: 10, title: "Promises and Async/Await", chapterTitle: "ES6+ Features" }
    ]
};

type ImportResult = {
    success: boolean;
    quizId?: number;
    quizTitle?: string;
    questionsImported?: number;
    totalAnswers?: number;
    errors?: string[];
};

export default function QuizImportPage() {
    const router = useRouter();
    const [courseId, setCourseId] = useState<number>(0);
    const [lessonId, setLessonId] = useState<number | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [showResultDialog, setShowResultDialog] = useState(false);

    const selectedCourseLessons = courseId ? mockLessons[courseId] || [] : [];

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
        if (!courseId || courseId === 0) {
            alert("Please select a course");
            return;
        }

        if (!selectedFile) {
            alert("Please select an Excel file to import");
            return;
        }

        setIsUploading(true);

        // Simulate API call
        setTimeout(() => {
            // Mock successful import
            const mockResult: ImportResult = {
                success: true,
                quizId: Math.floor(Math.random() * 1000),
                quizTitle: "Imported Quiz - " + selectedFile.name.replace('.xlsx', '').replace('.xls', ''),
                questionsImported: 10,
                totalAnswers: 40
            };

            setImportResult(mockResult);
            setShowResultDialog(true);
            setIsUploading(false);

            console.log("Import Request:", {
                courseId,
                lessonId,
                file: selectedFile.name,
                fileSize: selectedFile.size,
                fileType: selectedFile.type
            });
        }, 2000);
    };

    const handleResultDialogClose = () => {
        setShowResultDialog(false);
        if (importResult?.success) {
            // Redirect to quiz detail or quiz list
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
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockCourses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.title} ({course.lessons} lessons)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {courseId > 0 && selectedCourseLessons.length > 0 && (
                                <div>
                                    <Label htmlFor="lesson">Lesson (Optional)</Label>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Select if this is a lesson quiz
                                    </p>
                                    <Select
                                        value={lessonId?.toString()}
                                        onValueChange={(value) => setLessonId(parseInt(value))}
                                    >
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue placeholder="Select a lesson (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedCourseLessons.map((lesson) => (
                                                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                                                    {lesson.chapterTitle} → {lesson.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                <div className="space-y-3 text-sm">
                                    <p>Your quiz has been imported successfully.</p>
                                    <div className="bg-muted p-3 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Quiz Title:</span>
                                            <span className="font-semibold">{importResult.quizTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Questions:</span>
                                            <span className="font-semibold">{importResult.questionsImported}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Answers:</span>
                                            <span className="font-semibold">{importResult.totalAnswers}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Quiz ID:</span>
                                            <span className="font-semibold">#{importResult.quizId}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 text-sm">
                                    <p>There were errors importing your quiz:</p>
                                    <ul className="list-disc list-inside space-y-1 text-red-600">
                                        {importResult?.errors?.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
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
