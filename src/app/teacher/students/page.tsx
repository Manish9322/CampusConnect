import { ViewStudents } from "@/components/teacher/view-students";

export default function TeacherStudentsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Students</h1>
            <ViewStudents />
        </div>
    );
}
