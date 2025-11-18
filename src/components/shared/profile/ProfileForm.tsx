"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/types/response";
import { Loader2, Save } from "lucide-react";

interface ProfileFormProps {
    profile: UserResponse;
    onSave: (data: { firstName: string; lastName: string; bio?: string; learningGoals?: string }) => Promise<boolean>;
    isSaving?: boolean;
}

export function ProfileForm({ profile, onSave, isSaving = false }: ProfileFormProps) {
    const [firstName, setFirstName] = useState(() => {
        const parts = profile.fullName.split(" ");
        return parts[0] || "";
    });
    const [lastName, setLastName] = useState(() => {
        const parts = profile.fullName.split(" ");
        return parts.slice(1).join(" ") || "";
    });
    const [bio, setBio] = useState(profile.bio || "");
    const [learningGoals, setLearningGoals] = useState(profile.learningGoals || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({
            firstName,
            lastName,
            bio: bio || undefined,
            learningGoals: learningGoals || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Update your personal details and profile information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">
                                First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">
                                Last Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Brief description for your profile. Max 500 characters.
                        </p>
                    </div>

                    {/* Learning Goals */}
                    <div className="space-y-2">
                        <Label htmlFor="learningGoals">Learning Goals</Label>
                        <Textarea
                            id="learningGoals"
                            value={learningGoals}
                            onChange={(e) => setLearningGoals(e.target.value)}
                            placeholder="What do you want to achieve?"
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Share your learning objectives and goals.
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
