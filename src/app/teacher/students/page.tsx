import { ViewStudents } from "@/components/teacher/view-students";

export default function TeacherStudentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">My Students</h1>
            <ViewStudents />
        </div>
    );
}
