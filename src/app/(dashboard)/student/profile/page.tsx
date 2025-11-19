"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { AvatarUpload } from "@/components/shared/profile/AvatarUpload";
import { ProfileForm } from "@/components/shared/profile/ProfileForm";
import {
    Shield,
    BookOpen,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StudentProfilePage() {
    const { toast } = useToast();
    const { profile, isLoading, updateProfile, uploadAvatar, deleteAvatar } = useProfile();
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleAvatarUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const result = await uploadAvatar(file);
            if (result) {
                toast({
                    title: "Avatar updated",
                    description: "Your profile picture has been updated successfully.",
                });
                return result;
            } else {
                toast({
                    title: "Upload failed",
                    description: "Failed to upload avatar. Please try again.",
                    variant: "destructive",
                });
                return null;
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleAvatarDelete = async () => {
        if (!profile?.avatarUrl) return false;

        setIsUploading(true);
        try {
            const success = await deleteAvatar(profile.avatarUrl);
            if (success) {
                toast({
                    title: "Avatar removed",
                    description: "Your profile picture has been removed.",
                });
                return true;
            } else {
                toast({
                    title: "Delete failed",
                    description: "Failed to remove avatar. Please try again.",
                    variant: "destructive",
                });
                return false;
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileSave = async (data: {
        firstName: string;
        lastName: string;
        bio?: string;
        learningGoals?: string;
    }) => {
        if (!profile) return false;

        setIsSaving(true);
        try {
            const success = await updateProfile({
                id: profile.id,
                ...data,
            });

            if (success) {
                toast({
                    title: "Profile updated",
                    description: "Your profile has been updated successfully.",
                });
                return true;
            } else {
                toast({
                    title: "Update failed",
                    description: "Failed to update profile. Please try again.",
                    variant: "destructive",
                });
                return false;
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton height={40} width={200} />
                    <Skeleton height={20} width={300} />
                </div>
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <Skeleton height={100} />
                        <Skeleton height={200} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <Badge variant="secondary" className="h-fit">
                        <BookOpen className="mr-1 h-3 w-3" />
                        Student
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    Manage your profile information and learning preferences
                </p>
            </div>

            {/* Avatar Upload */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Upload a photo to personalize your learning profile
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AvatarUpload
                        currentAvatar={profile.avatarUrl}
                        userName={profile.fullName}
                        onUpload={handleAvatarUpload}
                        onDelete={handleAvatarDelete}
                        isUploading={isUploading}
                    />
                </CardContent>
            </Card>

            {/* Profile Form */}
            <ProfileForm
                profile={profile}
                onSave={handleProfileSave}
                isSaving={isSaving}
            />

            {/* Info Alert */}
            <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                    Your personal information is secure and will only be visible to you and
                    authorized administrators. Your learning goals help instructors provide
                    better guidance.
                </AlertDescription>
            </Alert>
        </div>
    );
}
