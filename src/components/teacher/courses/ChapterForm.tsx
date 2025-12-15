"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChapterRequest } from "@/types/request";
import { ChapterResponse } from "@/types/response";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const chapterFormSchema = z.object({
    title: z.string()
        .min(1, "Chapter title is required")
        .max(200, "Title must not exceed 200 characters"),
});

type ChapterFormValues = z.infer<typeof chapterFormSchema>;

interface ChapterFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    courseId: number;
    initialData?: ChapterResponse;
    onSubmit: (data: ChapterRequest) => Promise<void>;
    isLoading?: boolean;
}

export function ChapterForm({
    open,
    onOpenChange,
    mode,
    courseId,
    initialData,
    onSubmit,
    isLoading = false,
}: ChapterFormProps) {
    const form = useForm<ChapterFormValues>({
        resolver: zodResolver(chapterFormSchema),
        defaultValues: {
            title: initialData?.title || "",
        },
    });

    const handleFormSubmit = async (values: ChapterFormValues) => {
        try {
            const data: ChapterRequest = {
                title: values.title,
                courseId,
            };

            await onSubmit(data);
            form.reset();
            onOpenChange(false);
        } catch (error) {
            // Error is already handled by parent component
            console.error("Failed to submit chapter:", error);
        }
    };

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Add New Chapter" : "Edit Chapter"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new chapter for your course curriculum."
                            : "Update the chapter title."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chapter Title *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Introduction to Web Development"
                                            {...field}
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Saving..."
                                    : mode === "create"
                                    ? "Create Chapter"
                                    : "Update Chapter"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
