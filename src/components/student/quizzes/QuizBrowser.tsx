"use client"
import React, {Suspense, useState} from "react";
import {Input} from "@/components/ui/input";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";
import QuizzesList from "@/components/student/quizzes/QuizzesList";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const QuizBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1 max-w-xl">
                    <Input
                        type="text"
                        placeholder="Search quizzes by name or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-4">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Due Date"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            <SelectItem value="today">Due Today</SelectItem>
                            <SelectItem value="tomorrow">Due Tomorrow</SelectItem>
                            <SelectItem value="thisWeek">Due This Week</SelectItem>
                            <SelectItem value="thisMonth">Due This Month</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Suspense
                fallback={
                    <div className="flex justify-center py-8">
                        <FontAwesomeIcon icon={faRefresh} className="animate-spin text-2xl text-muted-foreground"/>
                    </div>
                }
            >
                <QuizzesList
                    searchTerm={searchTerm}
                    dateFilter={dateFilter}
                    statusFilter={statusFilter}
                />
            </Suspense>
        </div>
    )
}
export default QuizBrowser
