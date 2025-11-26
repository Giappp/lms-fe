import { TeacherCourseDetailPage } from "@/components/teacher/courses/TeacherCourseDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <TeacherCourseDetailPage params={params} />;
}
