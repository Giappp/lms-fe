"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CourseCreationRequest, CourseUpdateRequest } from "@/types/request";
import { CourseResponse } from "@/types/response";
import { CourseStatus, Difficulty } from "@/types/enum";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ThumbnailUploader } from "@/components/shared/upload/ThumbnailUploader";
import { useAllCategories } from "@/hooks/useCategories";
import { CategoryIcon } from "@/components/shared/CategoryIcon";

const courseFormSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must not exceed 200 characters"),
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must not exceed 1000 characters"),
    difficulty: z.nativeEnum(Difficulty, {
        message: "Please select a difficulty level",
    }),
    price: z.coerce.number()
        .min(0, "Price cannot be negative")
        .max(100000000, "Price cannot exceed $100,000,000"),
    status: z.nativeEnum(CourseStatus, {
        message: "Please select a course status",
    }),
    categoryIds: z.array(z.number()).optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
    mode: "create" | "edit";
    initialData?: CourseResponse;
    teacherId: number;
    teacherName: string;
    onSubmit: (data: CourseCreationRequest | CourseUpdateRequest, thumbnail?: File) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function CourseForm({
    mode,
    initialData,
    teacherId,
    teacherName,
    onSubmit,
    onCancel,
    isLoading = false,
}: CourseFormProps) {
    const { categories, isLoading: isCategoriesLoading } = useAllCategories();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailValue, setThumbnailValue] = useState<File | string | null>(
        initialData?.thumbnailUrl || null
    );
    const [selectedCategories, setSelectedCategories] = useState<number[]>(
        initialData?.categories?.map(c => c.id) || []
    );

    const form = useForm({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            difficulty: initialData?.difficulty || Difficulty.BEGINNER,
            price: initialData?.price || 0,
            status: initialData?.status || CourseStatus.DRAFT,
            categoryIds: selectedCategories,
        },
    });

    const handleThumbnailChange = (file: File | null) => {
        setThumbnail(file);
        setThumbnailValue(file);
    };

    const toggleCategory = (categoryId: number) => {
        setSelectedCategories(prev => {
            const newSelection = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];
            form.setValue("categoryIds", newSelection);
            return newSelection;
        });
    };

    const handleFormSubmit = async (values: CourseFormValues) => {
        const data = mode === "create"
            ? {
                  ...values,
                  teacherId,
                  teacherName,
                  categoryIds: selectedCategories,
              } as CourseCreationRequest
            : {
                  ...values,
                  categoryIds: selectedCategories,
              } as CourseUpdateRequest;

        await onSubmit(data, thumbnail || undefined);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Thumbnail Upload */}
                <div className="space-y-2">
                    <FormLabel>Course Thumbnail</FormLabel>
                    <ThumbnailUploader
                        value={thumbnailValue}
                        onChange={handleThumbnailChange}
                        disabled={isLoading}
                        maxSize={5}
                    />
                    <FormDescription>
                        Upload a thumbnail image for your course (JPEG, PNG, max 5MB)
                    </FormDescription>
                </div>

                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Title *</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="e.g., Complete Web Development Bootcamp" 
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormDescription>
                                A clear, descriptive title for your course
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe what students will learn in this course..."
                                    className="min-h-32"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormDescription>
                                Provide a detailed description of the course content
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Difficulty and Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difficulty Level *</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    disabled={isLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={Difficulty.BEGINNER}>
                                            Beginner
                                        </SelectItem>
                                        <SelectItem value={Difficulty.INTERMEDIATE}>
                                            Intermediate
                                        </SelectItem>
                                        <SelectItem value={Difficulty.ADVANCED}>
                                            Advanced
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (USD) *</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="pl-7"
                                            min="0"
                                            step="0.01"
                                            {...field}
                                            value={field.value as number}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Set to 0 for a free course
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Status */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Status *</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                disabled={isLoading}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={CourseStatus.DRAFT}>
                                        Draft
                                    </SelectItem>
                                    <SelectItem value={CourseStatus.PUBLISHED}>
                                        Published
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Draft courses are not visible to students
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Categories */}
                <div className="space-y-3">
                    <FormLabel>Categories (Optional)</FormLabel>
                    <FormDescription>
                        Select categories that best describe your course
                    </FormDescription>
                    {isCategoriesLoading ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-muted-foreground">Loading categories...</div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : categories.length > 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => {
                                        const isSelected = selectedCategories.includes(category.id);
                                        return (
                                            <Badge
                                                key={category.id}
                                                variant={isSelected ? "default" : "outline"}
                                                className="cursor-pointer px-3 py-2 text-sm font-medium transition-all hover:scale-105"
                                                style={{
                                                    backgroundColor: isSelected ? category.color : 'transparent',
                                                    borderColor: category.color,
                                                    color: isSelected ? '#ffffff' : category.color,
                                                }}
                                                onClick={() => !isLoading && toggleCategory(category.id)}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    {category.icon && (
                                                        <CategoryIcon icon={category.icon} className="w-3.5 h-3.5" />
                                                    )}
                                                    <span>{category.name}</span>
                                                </span>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-muted-foreground">No categories available</div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Form Errors */}
                {form.formState.errors.root && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                        {form.formState.errors.root.message}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : mode === "create" ? "Create Course" : "Update Course"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
