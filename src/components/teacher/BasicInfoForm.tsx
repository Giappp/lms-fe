'use client';

import {Controller, useForm} from 'react-hook-form';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {CourseStatus, Difficulty} from '@/types/enum';
import {CourseCreationRequest} from '@/types/request';
import React, {useEffect, useRef, useState} from 'react';
import ImagePreview from '@/components/teacher/ImagePreview';
import {Button} from '@/components/ui/button';
import {AlertCircle, Image as ImageIcon, Loader2, Upload} from 'lucide-react';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {cn} from '@/lib/utils';

export interface BasicInfoFormProps {
    initialData: Partial<CourseCreationRequest> & { submitted?: boolean } | null;
    onSaveAction: (data: CourseCreationRequest) => void;
    serverErrors?: Record<string, string> | null;
    disabled?: boolean;
}

export default function BasicInfoForm({
                                          initialData,
                                          onSaveAction,
                                          serverErrors,
                                          disabled = false
                                      }: BasicInfoFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
        setValue,
        setError,
        clearErrors,
        watch,
    } = useForm<Partial<CourseCreationRequest>>({
        defaultValues: initialData || {
            status: CourseStatus.DRAFT,
        },
    });

    // Watch for changes to provide better UX feedback
    const watchedTitle = watch('title');
    const watchedPrice = watch('price');

    // Map server-side validation errors to form fields
    useEffect(() => {
        if (serverErrors && Object.keys(serverErrors).length > 0) {
            Object.entries(serverErrors).forEach(([key, msg]) => {
                if (key !== 'general') {
                    setError(key as any, {type: 'server', message: msg});
                }
            });
        } else {
            clearErrors();
        }
    }, [serverErrors, setError, clearErrors]);

    // Set initial preview URL
    useEffect(() => {
        if (initialData?.thumbnail) {
            const url = URL.createObjectURL(initialData.thumbnail);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        if (initialData?.thumbnailUrl) {
            setPreviewUrl(initialData.thumbnailUrl);
        }
    }, [initialData?.thumbnail, initialData?.thumbnailUrl]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreviewUrl(null);
            setValue('thumbnail', undefined);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('thumbnail', {
                type: 'manual',
                message: 'Please select a valid image file'
            });
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('thumbnail', {
                type: 'manual',
                message: 'Image size must be less than 5MB'
            });
            return;
        }

        clearErrors('thumbnail');
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setValue('thumbnail', file);
    };

    const handleRemoveImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setValue('thumbnail', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: Partial<CourseCreationRequest>) => {
        try {
            onSaveAction(data as CourseCreationRequest);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const isLoading = isSubmitting || disabled;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Card className="border-none shadow-none sm:border sm:shadow-sm">
                <CardHeader className="space-y-1 px-4 sm:px-6">
                    <CardTitle className="text-xl sm:text-2xl">Course Information</CardTitle>
                    <CardDescription>
                        Fill in the basic details about your course
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-4 sm:px-6 space-y-6">
                    {/* General server error alert */}
                    {serverErrors?.general && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>{serverErrors.general}</AlertDescription>
                        </Alert>
                    )}

                    {/* Course Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Course Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            {...register('title', {
                                required: 'Course title is required',
                                minLength: {value: 5, message: 'Title must be at least 5 characters'},
                                maxLength: {value: 100, message: 'Title must be less than 100 characters'}
                            })}
                            placeholder="e.g., Complete Web Development Bootcamp"
                            disabled={isLoading}
                            className={cn(
                                "transition-colors",
                                errors.title && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3"/>
                                {errors.title.message}
                            </p>
                        )}
                        {watchedTitle && !errors.title && (
                            <p className="text-xs text-muted-foreground">
                                {watchedTitle.length}/100 characters
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            {...register('description', {
                                required: 'Course description is required',
                                minLength: {value: 20, message: 'Description must be at least 20 characters'},
                                maxLength: {value: 500, message: 'Description must be less than 500 characters'}
                            })}
                            placeholder="Describe what students will learn in this course..."
                            rows={5}
                            disabled={isLoading}
                            className={cn(
                                "resize-none transition-colors",
                                errors.description && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3"/>
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Difficulty & Price - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty" className="text-sm font-medium">
                                Difficulty Level <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="difficulty"
                                control={control}
                                rules={{required: 'Please select a difficulty level'}}
                                render={({field}) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger
                                            className={cn(
                                                "transition-colors",
                                                errors.difficulty && "border-red-500"
                                            )}
                                        >
                                            <SelectValue placeholder="Select difficulty"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(Difficulty).map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level.charAt(0) + level.slice(1).toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.difficulty && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3"/>
                                    {errors.difficulty.message}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium">
                                Price (USD) <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: {value: 0, message: 'Price must be 0 or greater'},
                                        max: {value: 9999, message: 'Price must be less than $10,000'}
                                    })}
                                    placeholder="0.00"
                                    disabled={isLoading}
                                    className={cn(
                                        "pl-7 transition-colors",
                                        errors.price && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                />
                            </div>
                            {errors.price && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3"/>
                                    {errors.price.message}
                                </p>
                            )}
                            {watchedPrice !== undefined && watchedPrice === 0 && !errors.price && (
                                <p className="text-xs text-muted-foreground">
                                    This course will be free
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="space-y-2">
                        <Label htmlFor="thumbnail" className="text-sm font-medium">
                            Course Thumbnail
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Recommended: 1280x720px, Max size: 5MB
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                            disabled={isLoading}
                        />

                        <div className="w-full">
                            {previewUrl ? (
                                <div className="relative">
                                    <ImagePreview
                                        previewUrl={previewUrl}
                                        onRemove={handleRemoveImage}
                                    />
                                </div>
                            ) : (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => !isLoading && fileInputRef.current?.click()}
                                    onKeyDown={(e) => {
                                        if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    className={cn(
                                        "border-2 border-dashed rounded-lg p-8 sm:p-12",
                                        "text-center cursor-pointer transition-all",
                                        "hover:border-primary hover:bg-accent/50",
                                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                        isLoading && "opacity-50 cursor-not-allowed",
                                        errors.thumbnail && "border-red-500"
                                    )}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            {isLoading ? (
                                                <Loader2 className="h-6 w-6 text-primary animate-spin"/>
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-primary"/>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Input
                            id="thumbnail"
                            type="hidden"
                            {...register('thumbnail')}
                        />

                        {errors.thumbnail && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3"/>
                                {errors.thumbnail.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button - Full width on mobile */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto min-w-[140px]"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Save & Continue
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}