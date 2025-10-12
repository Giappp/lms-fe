"use client"
import React, {Suspense, useState} from "react";
import {Input} from "@/components/ui/input";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";
import QuizzesList from "@/app/(dashboard)/student/ui/quizzes/QuizzesList";

const QuizBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-[480px]"
                />
            </div>
            <Suspense fallback={<FontAwesomeIcon icon={faRefresh}/>}>
                <QuizzesList/>
            </Suspense>
        </div>
    )
}
export default QuizBrowser
