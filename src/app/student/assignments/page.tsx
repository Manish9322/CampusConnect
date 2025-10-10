
import { AssignmentsList } from "@/components/student/assignments/assignments-list";
import { mockAssignments, mockGrades } from "@/lib/mock-data";
import { mockStudents } from "@/lib/mock-data";

export default function StudentAssignmentsPage() {
    const studentId = mockStudents[0].id; // Mock logged-in student Alice Johnson
    return (
        <div className="space-y-6">
            <AssignmentsList 
                assignments={mockAssignments}
                grades={mockGrades.filter(g => g.studentId === studentId)}
            />
        </div>
    );
}
