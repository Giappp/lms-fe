"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { EnrollmentService } from "@/api/services/enrollment-service";
import { useAuth } from "@/hooks/useAuth";

interface EnrollButtonProps {
    courseId: number;
    isEnrolled?: boolean;
    onEnrollmentChange?: (enrolled: boolean) => void;
    variant?: "default" | "outline" | "secondary";
    size?: "default" | "sm" | "lg";
    className?: string;
}

export function EnrollButton({
    courseId,
    isEnrolled = false,
    onEnrollmentChange,
    variant = "default",
    size = "default",
    className,
}: EnrollButtonProps) {
    const [enrolled, setEnrolled] = useState(isEnrolled);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    const handleEnroll = async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication required",
                description: "Please sign in to enroll in this course",
            });
            return;
        }

        setLoading(true);
        try {
            await EnrollmentService.requestEnrollment({ courseId, studentId: user.id });
            setEnrolled(true);
            onEnrollmentChange?.(true);
            toast({
                title: "Success!",
                description: "You have successfully enrolled in this course",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Enrollment failed",
                description: error instanceof Error ? error.message : "Failed to enroll in course",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async () => {
        setLoading(true);
        try {
            await EnrollmentService.cancelEnrollment(courseId);
            setEnrolled(false);
            onEnrollmentChange?.(false);
            toast({
                title: "Unenrolled",
                description: "You have been unenrolled from this course",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unenrollment failed",
                description: error instanceof Error ? error.message : "Failed to unenroll from course",
            });
        } finally {
            setLoading(false);
        }
    };

    if (enrolled) {
        return (
            <Button
                variant="outline"
                size={size}
                onClick={handleUnenroll}
                disabled={loading}
                className={className}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Unenroll
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleEnroll}
            disabled={loading}
            className={className}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enroll Now
        </Button>
    );
}
