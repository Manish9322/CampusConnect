
import { AssignmentsList } from "@/components/student/assignments/assignments-list";
import { mockAssignments, mockGrades } from "@/lib/mock-data";

export default function StudentAssignmentsPage() {
    const studentId = '1'; // Mock logged-in student Alice Johnson
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Assignments</h1>
            <AssignmentsList 
                assignments={mockAssignments}
                grades={mockGrades.filter(g => g.studentId === studentId)}
            />
        </div>
    );
}
