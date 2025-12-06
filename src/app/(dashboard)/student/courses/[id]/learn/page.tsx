import {LearningPage} from "@/components/student/courses/LearningPage";

export default function Page({params}: { params: Promise<{ id: string }> }) {

    return <LearningPage params={params}/>;
}
