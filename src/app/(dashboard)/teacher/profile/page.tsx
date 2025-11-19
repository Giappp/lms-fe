"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { AvatarUpload } from "@/components/shared/profile/AvatarUpload";
import { ProfileForm } from "@/components/shared/profile/ProfileForm";
import { QualificationUpload } from "@/components/teacher/profile/QualificationUpload";
import {
    User,
    Mail,
    Shield,
    CheckCircle,
    AlertCircle,
    GraduationCap,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TeacherProfilePage() {
    const { toast } = useToast();
    const { profile, isLoading, updateProfile, uploadAvatar, deleteAvatar } = useProfile();
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [isQualificationUploading, setIsQualificationUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock qualifications data (replace with real API when available)
    const [qualifications, setQualifications] = useState([
        {
            id: "1",
            name: "Master_Degree_Computer_Science.pdf",
            url: "https://example.com/file1.pdf",
            size: 2456789,
            uploadedAt: "2024-01-15T10:00:00Z",
        },
        {
            id: "2",
            name: "Teaching_Certificate.pdf",
            url: "https://example.com/file2.pdf",
            size: 1234567,
            uploadedAt: "2024-02-20T14:30:00Z",
        },
    ]);

    const handleAvatarUpload = async (file: File) => {
        setIsAvatarUploading(true);
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
            setIsAvatarUploading(false);
        }
    };

    const handleAvatarDelete = async () => {
        if (!profile?.avatarUrl) return false;

        setIsAvatarUploading(true);
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
            setIsAvatarUploading(false);
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

    const handleQualificationUpload = async (file: File) => {
        setIsQualificationUploading(true);
        try {
            // TODO: Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const newQualification = {
                id: Date.now().toString(),
                name: file.name,
                url: `https://example.com/qualifications/${Date.now()}-${file.name}`,
                size: file.size,
                uploadedAt: new Date().toISOString(),
            };

            setQualifications([...qualifications, newQualification]);

            toast({
                title: "Document uploaded",
                description: "Your qualification document has been uploaded successfully.",
            });

            return newQualification;
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Failed to upload document. Please try again.",
                variant: "destructive",
            });
            return null;
        } finally {
            setIsQualificationUploading(false);
        }
    };

    const handleQualificationDelete = async (fileUrl: string) => {
        try {
            // TODO: Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            setQualifications(qualifications.filter((q) => q.url !== fileUrl));

            toast({
                title: "Document removed",
                description: "Your qualification document has been removed.",
            });

            return true;
        } catch (error) {
            toast({
                title: "Delete failed",
                description: "Failed to remove document. Please try again.",
                variant: "destructive",
            });
            return false;
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
                    <Badge variant="default" className="h-fit">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        Teacher
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    Manage your profile information and professional credentials
                </p>
            </div>

            {/* Account Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{profile.fullName}</p>
                                <p className="text-xs text-muted-foreground">Full Name</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{profile.email}</p>
                                <p className="text-xs text-muted-foreground">Email Address</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    profile.isVerified
                                        ? "bg-green-500/10"
                                        : "bg-orange-500/10"
                                }`}
                            >
                                {profile.isVerified ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {profile.isVerified ? "Verified" : "Pending"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Verification Status
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Avatar Upload */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Upload a professional photo to help students recognize you
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AvatarUpload
                        currentAvatar={profile.avatarUrl}
                        userName={profile.fullName}
                        onUpload={handleAvatarUpload}
                        onDelete={handleAvatarDelete}
                        isUploading={isAvatarUploading}
                    />
                </CardContent>
            </Card>

            {/* Profile Form */}
            <ProfileForm
                profile={profile}
                onSave={handleProfileSave}
                isSaving={isSaving}
            />

            {/* Qualification Upload (Teacher Only) */}
            <QualificationUpload
                qualifications={qualifications}
                onUpload={handleQualificationUpload}
                onDelete={handleQualificationDelete}
                isUploading={isQualificationUploading}
            />

            {/* Info Alert */}
            <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                    Your personal information is secure and will only be visible to
                    authorized administrators. Professional qualifications may be displayed
                    to students to verify your credentials.
                </AlertDescription>
            </Alert>
        </div>
    );
}
