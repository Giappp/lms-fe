'use client';

import React from 'react';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {CourseResponse} from "@/types";
import {BookOpen, Clock, DollarSign, Edit, Eye, FileText, MoreVertical, TrendingUp, Users} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {formatDistanceToNow} from 'date-fns';

export interface CourseCardProps {
    course: CourseResponse;
    onView: (course: CourseResponse) => void;
    onEdit: (course: CourseResponse) => void;
    viewMode?: 'grid' | 'list';
}

export default function CourseCard({course, onView, onEdit, viewMode = 'grid'}: CourseCardProps) {
    const difficultyColors = {
        BEGINNER: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
        INTERMEDIATE: 'bg-primary/10 text-primary border-primary/20',
        ADVANCED: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    const statusColors = {
        PUBLISHED: 'bg-chart-4/10 text-chart-4',
        DRAFT: 'bg-muted text-muted-foreground',
        ARCHIVED: 'bg-destructive/10 text-destructive',
    };

    // Format date
    const formattedDate = course.updatedAt
        ? formatDistanceToNow(new Date(course.updatedAt), {addSuffix: true})
        : 'Recently';

    // List View
    if (viewMode === 'list') {
        return (
            <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/50">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Thumbnail */}
                        <div
                            className="relative flex-shrink-0 rounded-lg overflow-hidden bg-muted w-full sm:w-32 h-32 sm:h-24">
                            {course.thumbnailUrl ? (
                                <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <BookOpen className="w-8 h-8 mb-1"/>
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}
                            <Badge
                                variant="secondary"
                                className={`absolute top-2 right-2 ${statusColors[course.status]} text-xs`}
                            >
                                {course.status}
                            </Badge>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-3">
                            {/* Title and Category */}
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                        {course.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {course.description || 'No description available'}
                                </p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <Badge
                                    variant="outline"
                                    className={`${difficultyColors[course.difficulty]} capitalize`}
                                >
                                    {course.difficulty.toLowerCase()}
                                </Badge>

                                {course.categories && course.categories.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3"/>
                                        <span>{course.categories[0].name}</span>
                                        {course.categories.length > 1 && (
                                            <span
                                                className="text-muted-foreground">+{course.categories.length - 1}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3"/>
                                    <span>{course.enrolledCount || 0} students</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3"/>
                                    <span className="font-semibold text-foreground">
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3"/>
                                    <span>{formattedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center gap-2 sm:ml-auto">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onView(course)}
                                className="flex-1 sm:flex-none w-full sm:w-auto gap-2"
                            >
                                <Eye className="w-4 h-4"/>
                                <span className="sm:hidden">View</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => onEdit(course)}
                                className="flex-1 sm:flex-none w-full sm:w-auto gap-2"
                            >
                                <Edit className="w-4 h-4"/>
                                <span className="sm:hidden">Edit</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="sm:w-auto"
                                    >
                                        <MoreVertical className="w-4 h-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onView(course)}>
                                        <Eye className="w-4 h-4 mr-2"/>
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit(course)}>
                                        <Edit className="w-4 h-4 mr-2"/>
                                        Edit Course
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>
                                        <TrendingUp className="w-4 h-4 mr-2"/>
                                        View Analytics
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Grid View
    return (
        <Card
            className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 overflow-hidden flex flex-col h-full">
            {/* Thumbnail */}
            <div className="relative w-full h-48 bg-muted overflow-hidden">
                {course.thumbnailUrl ? (
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <BookOpen className="w-12 h-12 mb-2"/>
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                {/* Overlay badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <Badge
                        variant="secondary"
                        className={`${statusColors[course.status]} backdrop-blur-sm`}
                    >
                        {course.status}
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 w-7 p-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical className="w-4 h-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(course)}>
                                <Eye className="w-4 h-4 mr-2"/>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(course)}>
                                <Edit className="w-4 h-4 mr-2"/>
                                Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <TrendingUp className="w-4 h-4 mr-2"/>
                                View Analytics
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Price badge */}
                {course.price !== undefined && (
                    <Badge
                        variant="secondary"
                        className="absolute bottom-3 right-3 backdrop-blur-sm bg-background/90 border border-border"
                    >
                        <DollarSign className="w-3 h-3 mr-1"/>
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                    </Badge>
                )}
            </div>

            <CardHeader className="pb-3 space-y-2 flex-1">
                {/* Categories */}
                {course.categories && course.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {course.categories.slice(0, 2).map((cat, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-muted/50"
                            >
                                {cat.name}
                            </Badge>
                        ))}
                        {course.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-muted/50">
                                +{course.categories.length - 2}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description || 'No description available'}
                </p>
            </CardHeader>

            <CardContent className="pb-3 pt-0 space-y-3">
                {/* Difficulty and Stats */}
                <div className="flex items-center justify-between text-xs">
                    <Badge
                        variant="outline"
                        className={`${difficultyColors[course.difficulty]} capitalize`}
                    >
                        {course.difficulty.toLowerCase()}
                    </Badge>

                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3"/>
                            <span>{course.enrolledCount || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Updated date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3"/>
                    <span>Updated {formattedDate}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-border gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(course)}
                    className="flex-1 gap-2"
                >
                    <Eye className="w-4 h-4"/>
                    View
                </Button>
                <Button
                    size="sm"
                    onClick={() => onEdit(course)}
                    className="flex-1 gap-2"
                >
                    <Edit className="w-4 h-4"/>
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
}