import { StudentCourseDetailPage } from "@/components/student/courses/StudentCourseDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <StudentCourseDetailPage params={params} />;
}
