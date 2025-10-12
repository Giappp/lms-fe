import React from 'react'
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";
import QuizzesStat from "@/app/(dashboard)/student/ui/quizzes/QuizzesStat";
import QuizBrowser from "@/app/(dashboard)/student/ui/quizzes/QuizBrowser";

const Page = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-row justify-between mb-4">
                {/*Header*/}
                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-xl">Available Quizzes</h1>
                    <p>Browse and take quizzes from your enrolled courses</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Button variant={"outline"}>
                        <FontAwesomeIcon icon={faRefresh}/>
                        Refresh
                    </Button>
                    <Button>View History</Button>
                </div>
            </div>
            <QuizzesStat/>
            <QuizBrowser/>
        </div>
    )
}
export default Page
