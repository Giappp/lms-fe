'use client';

import {Controller, useForm} from 'react-hook-form';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {CourseStatus, Difficulty} from '@/types/enum';
import {CourseCreationRequest, CourseCreationRequest as CourseCreationRequestType} from '@/types/request';
import React, {useEffect, useRef, useState} from 'react';
import ImagePreview from "@/components/teacher/ImagePreview";
import {Button} from "@/components/ui/button";

export interface BasicInfoFormProps {
    initialData: Partial<CourseCreationRequest> & { submitted?: boolean } | null
    // Emit raw form data to parent; parent will handle create/update
    onSaveAction: (data: CourseCreationRequestType) => void;
    // Optional server-side validation errors mapped by field name
    serverErrors?: Record<string, string> | null;
}

export default function BasicInfoForm({initialData, onSaveAction, serverErrors}: BasicInfoFormProps) {
    const [saving, setSaving] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        setError,
        clearErrors,
    } = useForm<Partial<CourseCreationRequest>>({
        defaultValues: initialData || {
            status: CourseStatus.DRAFT,
        },
    });

    // If parent passes server-side validation errors, map them to form fields
    React.useEffect(() => {
        if (serverErrors && Object.keys(serverErrors).length > 0) {
            Object.entries(serverErrors).forEach(([key, msg]) => {
                setError(key as any, {type: 'server', message: msg});
            });
        } else {
            // clear previous server errors when there are none
            clearErrors();
        }
    }, [serverErrors, setError, clearErrors]);

    useEffect(() => {
        if (initialData?.thumbnail) {
            setPreviewUrl(URL.createObjectURL(initialData.thumbnail));
        }
        if (initialData?.thumbnailUrl) {
            setPreviewUrl(initialData.thumbnailUrl);
        }
    }, [initialData?.thumbnail, initialData?.thumbnailUrl]);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = useRef<AbortController | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreviewUrl(null);
            setValue('thumbnail', undefined); // reset
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
        setValue('thumbnail', file);
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        if (abortController.current) abortController.current.abort();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (data: Partial<CourseCreationRequest>) => {
        setSaving(true);
        try {
            // Emit raw data (including thumbnail File if selected) to parent
            onSaveAction?.(data as CourseCreationRequestType);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-6 space-y-6 mx-auto max-w-3xl">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                            id="title"
                            className={errors.title ? 'border-red-500' : ''}
                            {...register('title', {required: 'Title is required'})}
                            placeholder="Enter course title"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">{errors.title?.message as string}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            className={errors.description ? 'border-red-500' : ''}
                            {...register('description', {required: 'Description is required'})}
                            placeholder="Enter course description"
                            rows={5}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">{errors.description?.message as string}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="difficulty">Difficulty Level</Label>
                            <Controller
                                name="difficulty"
                                control={control}
                                rules={{required: 'Difficulty is required'}}
                                render={({field}) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
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
                        </div>

                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                className={errors.price ? 'border-red-500' : ''}
                                {...register('price', {
                                    required: 'Price is required',
                                    min: {value: 0, message: 'Price must be positive'}
                                })}
                                placeholder="Enter course price"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500 mt-1">{errors.price?.message as string}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="thumbnail">Thumbnail Image</Label>
                        <div className="flex w-full max-w-lg flex-col mx-auto p-2 space-y-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <div className="flex flex-col   w-full items-center justify-center">
                                {previewUrl ? (
                                    <div className="flex justify-center items-center space-x-4">
                                        <ImagePreview previewUrl={previewUrl} onRemove={handleRemoveImage}/>
                                    </div>
                                ) : (
                                    <div
                                        role="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <p className="text-gray-500">Click or drag an image here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Input id="thumbnail"
                               type="hidden" {...register('thumbnail')} />
                        {errors.thumbnail && (
                            <p className="text-sm text-red-500 mt-1">{errors.thumbnail?.message as string}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="submit"
                        variant="default"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save & Continue'}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
