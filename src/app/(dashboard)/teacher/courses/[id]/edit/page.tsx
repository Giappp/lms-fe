import { CourseEditPage } from "@/components/teacher/courses/CourseEditPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CourseEditPage params={params} />;
}
