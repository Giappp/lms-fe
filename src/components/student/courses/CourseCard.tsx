import {CourseResponse} from "@/types";
import {useState} from "react";
import Link from "next/link";
import {BookOpen, Clock, ShoppingCart, Star, User} from "lucide-react";
import {CourseStatus, Difficulty} from "@/types/enum";
import {BarChart} from "recharts";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

export default function CourseCard({course}: { course: CourseResponse }) {
    const [isHovered, setIsHovered] = useState(false);

    const getDifficultyColor = (diff: Difficulty) => {
        switch (diff) {
            case Difficulty.BEGINNER:
                return "text-foreground bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
            case Difficulty.INTERMEDIATE:
                return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case Difficulty.ADVANCED:
                return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div
            className="group flex flex-col h-full rounded-[var(--radius-lg)] border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. Clickable Image Area */}
            <Link href={`/student/learn/${course.id}`}
                  className="relative block aspect-video w-full overflow-hidden bg-muted cursor-pointer">
                {course.thumbnailUrl ? (
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/30">
                        <BookOpen className="h-10 w-10 text-muted-foreground/40"/>
                    </div>
                )}

                {/* Overlay Badge for Difficulty - Glassmorphism style */}
                <div className="absolute top-3 right-3 z-10">
          <span
              className={`backdrop-blur-md px-2.5 py-1 rounded-[var(--radius-sm)] text-[10px] font-semibold border ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
                </div>

                {/* Status Badge (if not published) */}
                {course.status !== CourseStatus.PUBLISHED && (
                    <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm">
                            {course.status}
                        </Badge>
                    </div>
                )}
            </Link>

            {/* 2. Content Body */}
            <div className="flex flex-1 flex-col p-5 gap-3">
                {/* Meta Row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-primary/80 uppercase tracking-wider flex items-center gap-1">
                        {course.categories && course.categories.length > 0 ? course.categories[0].name : "General"}
                    </span>

                    {/* Rating (Optional Enhancement) */}
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current"/>
                        <span className="text-foreground font-medium">{course.rating || "4.8"}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/student/learn/${course.id}`}
                      className="block group-hover:text-primary transition-colors duration-200">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2">
                        {course.title}
                    </h3>
                </Link>

                {/* Created Date */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5"/>
                        <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Teacher & Price Section */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <div
                            className="h-8 w-8 rounded-full ring-1 ring-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-muted-foreground"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Instructor</span>
                            <span className="text-xs font-medium truncate max-w-[100px] leading-none">
                    {course.teacherName}
                </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        {course.price > 0 && <span
                            className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50 leading-none mb-0.5">${(course.price * 1.5).toFixed(2)}</span>}
                        <div className="flex items-center gap-1 font-bold text-lg text-primary leading-none">
                            {course.price === 0 ? (
                                <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                            ) : (
                                <>
                                    <span className="text-xs align-top relative top-[-2px]">$</span>
                                    <span>{course.price.toFixed(2)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. CTA Actions Area */}
            <div className="p-5 pt-0 mt-1 grid grid-cols-2 gap-3">
                <Link href={`/student/learn/${course.id}`} className="w-full">
                    <Button variant="outline" className="w-full" size="sm">
                        View Detail
                    </Button>
                </Link>
                <Button className="w-full gap-2 shadow-sm" size="sm">
                    <ShoppingCart className="w-3.5 h-3.5"/>
                    Enroll
                </Button>
            </div>
        </div>
    );
}