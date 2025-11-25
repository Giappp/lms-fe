"use client"
import React from 'react'
import {Badge} from "@/components/ui/badge";
import {
    Check,
    Clock,
    Download,
    FileText,
    Globe,
    Heart,
    InfinityIcon,
    MonitorPlay,
    PlayCircle,
    Share2,
    Smartphone,
    Star,
    Trophy,
    Users
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {useRequest} from "@/hooks/useRequest";
import {ChapterResponse, CourseDetailResponse, InstructorResponse} from "@/types";

const whatYouWillLearn = [
    "Build enterprise-level applications with Next.js 14 and TypeScript",
    "Master the latest React features including Server Components and Suspense",
    "Implement secure authentication with NextAuth.js and OAuth",
    "Deploy scalable applications using Vercel and Docker containers",
    "Design responsive UIs with Tailwind CSS and Shadcn UI",
    "Manage complex state with Redux Toolkit and React Query"
];

const DEFAULT_META = {
    lastUpdated: "November 2024",
    subtitle: "Become a full-stack developer with React, Node.js, Next.js 14, and TypeScript. Build real-world projects from scratch.",
    language: "English",
    captions: ["English", "Spanish", "Portuguese"],
    features: [
        "65 hours on-demand video",
        "85 coding exercises",
        "42 downloadable resources",
        "Full lifetime access",
        "Access on mobile and TV",
        "Certificate of completion"
    ],
    originalPrice: 199.99,
    discount: 55,
    instructor: {
        name: "Dr. Sarah Chen",
        role: "Senior Software Architect & Instructor",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        rating: 4.9,
        reviews: 2456,
        students: 45000,
        courses: 12,
        bio: "Sarah is a Senior Software Architect with over 15 years of experience in the industry. She has worked with companies like Google and Netflix. She loves teaching complex topics in a simple, understandable way."
    }
}

type VideoProps = {
    thumbnailUrl: string;
}

const VideoPreview = ({thumbnailUrl}: VideoProps) => (
    <div
        className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-slate-900 group cursor-pointer border-b border-border">
        <img
            src={thumbnailUrl}
            alt="Preview"
            className="h-full w-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-background rounded-full animate-ping opacity-20"></div>
                <PlayCircle className="h-16 w-16 text-white drop-shadow-2xl relative z-10 fill-white/10"/>
            </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-white font-semibold text-sm drop-shadow-md">Preview this course</span>
        </div>
    </div>
);

const StickySidebar = ({data}: { data: CourseDetailResponse }) => (
    <div className="sticky top-24 h-fit">
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Video Preview Area */}
            <VideoPreview thumbnailUrl={data.thumbnailUrl}/>

            {/* Pricing & CTA */}
            <div className="p-6 space-y-6">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-foreground">${data.price}</span>
                    <span
                        className="text-base text-muted-foreground line-through">${data.originalPrice || DEFAULT_META.originalPrice}</span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {data.discount || DEFAULT_META.discount}% Off
            </span>
                </div>

                <div className="space-y-3">
                    <Button className="w-full h-12 text-base font-semibold shadow-sm" size="lg">
                        Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full h-12 text-base font-semibold" size="lg">
                        Buy Now
                    </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    30-Day Money-Back Guarantee
                </div>

                <Separator/>

                <div className="space-y-4">
                    <h4 className="font-semibold text-sm">This course includes:</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-3">
                            <MonitorPlay className="h-4 w-4 text-primary shrink-0"/>
                            <span>{DEFAULT_META.features[0]}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-primary shrink-0"/>
                            <span>{DEFAULT_META.features[1]}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Download className="h-4 w-4 text-primary shrink-0"/>
                            <span>{DEFAULT_META.features[2]}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <InfinityIcon className="h-4 w-4 text-primary shrink-0"/>
                            <span>{DEFAULT_META.features[3]}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-primary shrink-0"/>
                            <span>{DEFAULT_META.features[4]}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Trophy className="h-4 w-4 text-primary shrink-0"/>
                            <span>{DEFAULT_META.features[5]}</span>
                        </li>
                    </ul>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Share2 className="h-3.5 w-3.5 mr-2"/> Share
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Heart className="h-3.5 w-3.5 mr-2"/> Wishlist
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

const WhatYouWillLearn = ({points}: { points: string[] }) => (
    <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold mb-4">What you&#39;ll learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {points.map((point, index) => (
                <div key={index} className="flex gap-3 items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
                    <span className="text-sm text-card-foreground/90 leading-relaxed">{point}</span>
                </div>
            ))}
        </div>
    </div>
);

const CurriculumList = ({sections}: { sections: ChapterResponse[] }) => {
    const totalLength = sections.reduce((acc, s) => acc + s.durationInMinutes, 0);
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Course Content</h2>
                <div className="text-sm text-muted-foreground">
                <span
                    className="font-medium text-foreground">{sections.reduce((acc, s) => acc + s.lectures, 0)}</span> lectures
                    • <span className="font-medium text-foreground">{totalLength.toLocaleString()}m</span> total length
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
                <Accordion type="single" collapsible
                           className="rounded-lg border border-border bg-card overflow-hidden">
                    {sections.map((section, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                            <AccordionTrigger className="px-4">
                                {section.title}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-1 pt-1">
                                    {section.lessons.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-2 pl-2 pr-4 hover:bg-muted/50 rounded-md group text-sm cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <PlayCircle
                                                    className="h-4 w-4 text-muted-foreground group-hover:text-primary"/>
                                                <span
                                                    className="text-muted-foreground group-hover:text-foreground transition-colors">
                                                {item.title}
                                            </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {item.isFree && (
                                                    <span
                                                        className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
                                                    Preview
                                                </span>
                                                )}
                                                <span className="text-xs text-muted-foreground tabular-nums">
                                                {item.durationInMinutes}
                                            </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

const InstructorCard = ({instructor}: { instructor: InstructorResponse }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">Instructor</h2>
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={instructor.avatarUrl} alt={instructor.name} className="h-full w-full object-cover"/>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-primary underline-offset-4 hover:underline cursor-pointer">{instructor.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{instructor.role}</p>

                    <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-current text-amber-500"/>
                            <span>{instructor.rating || DEFAULT_META.instructor.rating} Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5"/>
                            <span>{instructor.students?.toLocaleString() || DEFAULT_META.instructor.students.toLocaleString()} Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <PlayCircle className="h-3.5 w-3.5"/>
                            <span>{instructor.courses} Courses</span>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-card-foreground/80 leading-relaxed">
                {instructor.bio}
            </p>
        </div>
    </div>
);

const CourseDetailPage = ({courseId}: { courseId: number }) => {
    // const data = COURSE_DATA;
    const key = courseId != null ? `/api/courses/${courseId}/details` : null;
    const {
        data,
        isLoading,
        isError,
        error
    } = useRequest<CourseDetailResponse>(key)

    // Add debugging - remove after fixing
    console.log('CourseDetailPage Debug:', {
        courseId,
        key,
        isLoading,
        isError,
        hasData: !!data,
        error
    });
    if (isLoading) {
        return <div className="flex items-center justify-center h-64 text-gray-500">
            <svg className="w-8 h-8 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading course details...</span>
        </div>;
    }

    if (isError) {
        return <div className="flex items-center justify-center h-64 text-red-500">
            <svg className="w-8 h-8 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"/>
            </svg>
            <span>Error loading course details. Please try again later.</span>
        </div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center h-64">
            <span>No course found</span>
        </div>;
    }

    return (
        <main className="pb-16 p-6">
            {/* Top Hero Section */}
            <div className="bg-slate-900 text-slate-50 py-12">
                <div className="container max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                            {data?.title}
                        </h1>
                        <p className="text-lg text-slate-300 mb-4 max-w-2xl">
                            {data?.subtitle || DEFAULT_META.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                            <Badge variant="accent"
                                   className="bg-amber-400 text-amber-900 hover:bg-amber-500 font-bold border-none">
                                Bestseller
                            </Badge>
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                                <span className="text-base">{data?.rating}</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="h-4 w-4 fill-current"/>
                                    ))}
                                </div>
                            </div>
                            <span className="text-slate-400 underline decoration-slate-600 underline-offset-2">
                            (3,450 ratings)
                        </span>
                            <span className="text-slate-200">
                            {data?.students.toLocaleString()} students
                        </span>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-white">Created by</span>
                                <span
                                    className="text-primary underline-offset-4 hover:underline cursor-pointer">{data?.instructor.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4"/>
                                <span>Last updated {DEFAULT_META.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4"/>
                                <span>{data?.language || DEFAULT_META.language}</span>
                            </div>
                        </div>
                    </div>
                    {/* Right column in hero is empty, sidebar will float over in the next section container */}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container max-w-7xl mx-auto px-4 mt-8">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column (Details) */}
                    <div className="lg:col-span-2 space-y-12">

                        <WhatYouWillLearn points={whatYouWillLearn}/>

                        <CurriculumList sections={data?.chapters}/>

                        {/* Requirements Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Basic understanding of HTML, CSS, and JavaScript</li>
                                <li>A computer with internet access (Windows, Mac, or Linux)</li>
                                <li>No prior React or backend knowledge required</li>
                            </ul>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Description</h2>
                            <div className="text-sm text-card-foreground/80 space-y-4 leading-relaxed">
                                <p>
                                    Welcome to the most comprehensive Full-Stack Web Development Bootcamp!
                                    This course is designed to take you from a junior developer to a confident Senior
                                    Software Engineer
                                    capable of building large-scale applications.
                                </p>
                                <p>
                                    We don&apos;t just cover the &#34;how&#34;, but also the &#34;why&#34;. You will
                                    learn design patterns,
                                    best practices, and performance optimization techniques used by top tech companies.
                                </p>
                                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                                    <p className="font-semibold text-foreground mb-2">Key topics covered:</p>
                                    <div className="grid sm:grid-cols-2 gap-2">
                                        <span className="flex items-center gap-2"><div
                                            className="h-1.5 w-1.5 rounded-full bg-primary"/>Next.js 14 App Router</span>
                                        <span className="flex items-center gap-2"><div
                                            className="h-1.5 w-1.5 rounded-full bg-primary"/>TypeScript Generics</span>
                                        <span className="flex items-center gap-2"><div
                                            className="h-1.5 w-1.5 rounded-full bg-primary"/>Server Actions</span>
                                        <span className="flex items-center gap-2"><div
                                            className="h-1.5 w-1.5 rounded-full bg-primary"/>Prisma ORM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <InstructorCard instructor={data?.instructor}/>

                        {/* Reviews Preview (Simplified) */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Star className="h-6 w-6 fill-amber-500 text-amber-500"/>
                                {data?.rating} course rating • 3K ratings
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-t border-border pt-6">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div
                                                className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">JD
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">John Doe</div>
                                                <div className="flex gap-0.5 text-amber-500">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s}
                                                                                    className="h-3 w-3 fill-current"/>)}
                                                </div>
                                            </div>
                                            <div className="ml-auto text-xs text-muted-foreground">2 days ago</div>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            This course is absolutely amazing. The instructor explains everything so
                                            clearly.
                                            I finally understand how Redux works after struggling for months!
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full">See all reviews</Button>
                        </div>

                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <div className="relative lg:block hidden">
                        <div className="absolute -top-[280px] w-full">
                            <StickySidebar data={data}/>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
export default CourseDetailPage
