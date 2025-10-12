'use client'
import React from 'react'
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Card, CardContent} from "@/components/ui/card"
import {Rating, RatingButton} from "@/components/ui/shadcn-io/rating"
import Image from "next/image"
import {BarChart2, CheckCircle, Clock, GraduationCap, PlayCircle} from 'lucide-react'

type Props = {
    params: string
};

const Page = ({params}: Props) => {
    const courseId = params;

    // This would normally come from an API call
    const courseData = {
        title: "Complete Web Development Bootcamp",
        description: "Learn web development from scratch to advanced concepts with practical projects",
        rating: 4.8,
        reviews: 1234,
        instructor: "John Doe",
        difficulty: "Intermediate",
        thumbnail: "/course-thumbnail.jpg",
        price: 499000,
        learningObjectives: [
            "Build 20+ web development projects",
            "Master HTML, CSS, and JavaScript",
            "Learn React and Next.js",
            "Understand backend development"
        ],
        skills: [
            {name: "Web Design", level: "Intermediate"},
            {name: "Frontend Development", level: "Advanced"},
            {name: "Algorithms", level: "Beginner"},
            {name: "Database Management", level: "Intermediate"},
            {name: "API Development", level: "Intermediate"}
        ],
        details: {
            materials: ["70+ hours of HD video", "300+ coding exercises", "50+ downloadable resources", "Full source code"],
            languages: ["English", "Subtitles: 10 languages"],
            assessments: ["40 quizzes", "15 assignments", "5 major projects", "Certificate of completion"]
        }
    }

    return (
        <section className="max-w-6xl p-6">
            {/* Hero Section */}
            <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="col-span-2 space-y-4">
                    <h1 className="text-3xl font-bold">{courseData.title}</h1>
                    <p className="text-muted-foreground">{courseData.description}</p>

                    <div className="flex items-center gap-4">
                        <Rating defaultValue={courseData.rating} readOnly>
                            <span className="text-sm text-yellow-500 font-semibold">
                                {courseData.rating}
                            </span>
                            {Array.from({length: 5}).map((_, index) => (
                                <RatingButton
                                    className=" text-yellow-500"
                                    key={index}
                                />
                            ))}
                            <span className="text-sm text-muted-foreground">
                                ({courseData.reviews} reviews)
                            </span>
                        </Rating>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4"/>
                            {courseData.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                            <BarChart2 className="w-4 h-4"/>
                            {courseData.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4"/>
                            20 hours
                        </span>
                    </div>
                    {/* What You'll Learn Section */}
                    <div className="mb-8 p-8 border border-border">
                        <h2 className="text-base mb-4">What You&#39;ll Learn</h2>
                        <div className="grid grid-cols-2 gap-2 space-y-2">
                            {courseData.learningObjectives.map((objective, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-1"/>
                                    <span className="text-sm">{objective}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="p-4">
                    <CardContent className="space-y-4">
                        <Image
                            src={courseData.thumbnail}
                            alt={courseData.title}
                            width={400}
                            height={225}
                            className="rounded-lg"
                        />
                        <div className="text-2xl">
                            ₫<span className="font-bold">{courseData.price.toLocaleString()}</span>
                        </div>
                        <Button className="w-full font-semibold" size="lg" variant={"default"}>
                            Buy Now
                        </Button>
                        <Button className="w-full" size="lg" variant="outline">Preview Course</Button>

                        <div className="pt-6">
                            <h3 className="text-sm font-semibold mb-3">This course includes:</h3>
                            <ul className="space-y-2">
                                {courseData.details.materials.map((material, index) => (
                                    <li key={index}
                                        className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500"/>
                                        {material}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-8"/>

            {/* Skills Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Skills You&#39;ll Gain</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {courseData.skills.map((skill, index) => (
                        <div key={index}
                             className="flex flex-col justify-center items-center gap-1 p-2 bg-muted rounded-full h-[48px]">
                            <span className="text-sm font-semibold">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">Level: {skill.level}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="my-8"/>

            {/* Course Details Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Details to know</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-semibold mb-3">Language</h3>
                            <ul className="space-y-2">
                                {courseData.details.languages.map((language, index) => (
                                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500"/>
                                        {language}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-semibold mb-3">Assessments</h3>
                            <ul className="space-y-2">
                                {courseData.details.assessments.map((assessment, index) => (
                                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500"/>
                                        {assessment}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator className="my-8"/>

            {/* Course Content Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <Accordion type="multiple" className="w-full">
                    {[1, 2, 3].map((chapter) => (
                        <AccordionItem key={chapter} value={`chapter-${chapter}`}>
                            <AccordionTrigger>
                                <p>Chapter {chapter}: Introduction to Web Development</p>
                                <span className="text-muted-foreground text-end">6 lectures • 26min</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pl-4">
                                    {[1, 2, 3].map((lesson) => (
                                        <div key={lesson}
                                             className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                                            <PlayCircle className="w-4 h-4"/>
                                            <span>Lesson {lesson}: Getting Started</span>
                                            <span className="ml-auto text-sm text-muted-foreground">15:00</span>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <Separator className="my-8"/>

            {/* Instructor Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
                <div className="flex items-start gap-4">
                    <Image
                        src="/instructor-avatar.jpg"
                        alt="Instructor"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{courseData.instructor}</h3>
                        <p className="text-muted-foreground">Web Development Instructor</p>
                        <p className="mt-2">
                            10+ years of experience in web development. Taught over 500,000 students worldwide.
                            Passionate about making complex topics easy to understand.
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="my-8"/>

            {/* Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                        <Card key={review} className="p-4">
                            <CardContent>
                                <div className="flex items-center gap-2 mb-2">
                                    <Rating defaultValue={5} readOnly>
                                        {Array.from({length: 5}).map((_, index) => (
                                            <RatingButton
                                                className="text-yellow-500"
                                                key={index}
                                            />
                                        ))}
                                    </Rating>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Great course! Very detailed and well-explained.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">Student Name</span>
                                    <span className="text-xs text-muted-foreground">• 2 days ago</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Page
