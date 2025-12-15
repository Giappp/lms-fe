"use client"
import React, {Suspense, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";

const QuizBrowser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    return (
        <div className="space-y-6">
            <Suspense
                fallback={
                    <div className="flex justify-center py-8">
                        <FontAwesomeIcon icon={faRefresh} className="animate-spin text-2xl text-muted-foreground"/>
                    </div>
                }
            >
            </Suspense>
        </div>
    )
}
export default QuizBrowser
