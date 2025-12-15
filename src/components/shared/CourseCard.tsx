"use client"

import { CourseResponse } from "@/types/response";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    Star, 
    Users, 
    Clock, 
    DollarSign, 
    BookOpen,
    TrendingUp,
    Award
} from "lucide-react";
import { Difficulty, CourseStatus } from "@/types/enum";
import { useRouter } from "next/navigation";

interface CourseCardProps {
    course: CourseResponse;
    variant?: "default" | "compact" | "detailed";
    showActions?: boolean;
    onEdit?: (courseId: number) => void;
    onDelete?: (courseId: number) => void;
}

export function CourseCard({ 
    course, 
    variant = "default",
    showActions = false,
    onEdit,
    onDelete 
}: CourseCardProps) {
    const router = useRouter();

    const getDifficultyColor = (difficulty: Difficulty) => {
        switch (difficulty) {
            case Difficulty.BEGINNER:
                return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
            case Difficulty.INTERMEDIATE:
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
            case Difficulty.ADVANCED:
                return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getDifficultyIcon = (difficulty: Difficulty) => {
        switch (difficulty) {
            case Difficulty.BEGINNER:
                return <BookOpen className="h-3 w-3" />;
            case Difficulty.INTERMEDIATE:
                return <TrendingUp className="h-3 w-3" />;
            case Difficulty.ADVANCED:
                return <Award className="h-3 w-3" />;
        }
    };

    const handleCardClick = () => {
        if (!showActions) {
            router.push(`/courses/${course.id}`);
        }
    };

    if (variant === "compact") {
        return (
            <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img 
                            src={course.thumbnailUrl || "/placeholder-course.jpg"} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{course.teacherName}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {course.difficulty}
                            </Badge>
                            {course.rating > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{course.rating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-primary">${course.price}</p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card 
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <img 
                    src={course.thumbnailUrl || "/placeholder-course.jpg"} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                    {course.status === CourseStatus.PUBLISHED && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                            Published
                        </Badge>
                    )}
                    {course.status === CourseStatus.DRAFT && (
                        <Badge variant="secondary">
                            Draft
                        </Badge>
                    )}
                </div>
                <div className="absolute top-3 left-3">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                        <span className="flex items-center gap-1">
                            {getDifficultyIcon(course.difficulty)}
                            {course.difficulty}
                        </span>
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {course.description}
                </p>
            </CardHeader>

            <CardContent className="pb-3">
                {/* Categories */}
                {course.categories && course.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {course.categories.slice(0, 3).map((category) => (
                            <Badge 
                                key={category.id} 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                    borderColor: category.color,
                                    color: category.color 
                                }}
                            >
                                {category.icon && <span className="mr-1">{category.icon}</span>}
                                {category.name}
                            </Badge>
                        ))}
                        {course.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{course.categories.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Teacher Info */}
                <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.teacherName}`} />
                        <AvatarFallback>{course.teacherName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{course.teacherName}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                        {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{course.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                            {new Date(course.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t">
                {showActions ? (
                    <div className="flex gap-2 w-full">
                        <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(course.id);
                            }}
                        >
                            Edit
                        </Button>
                        <Button 
                            variant="destructive" 
                            className="flex-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(course.id);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold text-primary">
                                {course.price === 0 ? "Free" : course.price}
                            </span>
                        </div>
                        <Button>
                            View Course
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
