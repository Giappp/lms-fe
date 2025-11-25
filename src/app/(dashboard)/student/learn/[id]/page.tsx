import CourseDetailPage from "@/components/student/courses/CourseDetailPage";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = async ({params}: Props) => {
    const {id} = await params;
    const courseId = Number(id);
    console.log("Received id: ", courseId);
    return (
        <CourseDetailPage courseId={courseId}/>
    );
};
export default Page
