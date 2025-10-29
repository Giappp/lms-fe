'use client';

import {useForm} from 'react-hook-form';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {CourseStatus, Difficulty} from '@/types/enum';
import {CourseCreationRequest} from '@/types/request';
import {useState} from 'react';
import ImageUploader from "@/components/teacher/ImageUploader";

export interface BasicInfoFormProps {
    initialData: Partial<CourseCreationRequest> | null
    onSaveAction: (data: CourseCreationRequest) => void;
}

export default function BasicInfoForm({initialData, onSaveAction}: BasicInfoFormProps) {
    const [saving, setSaving] = useState(false);

    const {register, handleSubmit, formState: {errors}, setValue} = useForm<Partial<CourseCreationRequest>>({
        defaultValues: initialData || {
            status: CourseStatus.DRAFT,
            rating: 0,
        },
    });

    const onSubmit = async (data: Partial<CourseCreationRequest>) => {
        setSaving(true);
        onSaveAction?.(data as CourseCreationRequest);
    };

    function handleUploaded(url: string) {
        console.log('Uploaded image URL:', url);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-6 space-y-6 mx-auto max-w-3xl">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                            id="title"
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
                            <Select
                                {...register('difficulty', {required: 'Difficulty is required'})}
                                defaultValue={initialData?.difficulty}
                            >
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
                        </div>

                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                {...register('price', {
                                    required: 'Price is required',
                                    min: {value: 0, message: 'Price must be positive'}
                                })}
                                placeholder="Enter course price"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="duration">Estimated Duration</Label>
                        <Input
                            id="duration"
                            {...register('duration', {required: 'Duration is required'})}
                            placeholder="e.g., 2 weeks, 10 hours"
                        />
                    </div>

                    <div>
                        <Label htmlFor="thumbnail">Thumbnail Image</Label>
                        <ImageUploader onUploaded={handleUploaded}/>
                        <input type="hidden" {...register('thumbnail', {required: 'Thumbnail is required'})} />
                        {errors.thumbnail && (
                            <p className="text-sm text-red-500 mt-1">{errors.thumbnail?.message as string}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save & Continue'}
                    </button>
                </div>
            </Card>
        </form>
    );
}
