
import { mockAssignments, mockClasses } from "@/lib/mock-data";
import { AssignmentDataTable } from "@/components/teacher/assignments/assignment-data-table";

export default function TeacherAssignmentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Assignments</h1>
            <AssignmentDataTable 
                initialAssignments={mockAssignments}
                teacherClasses={mockClasses.filter(c => ['CS101', 'CS303'].includes(c.name))} 
            />
        </div>
    );
}
