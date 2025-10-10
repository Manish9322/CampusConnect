
import { GradebookTable } from "@/components/teacher/gradebook/gradebook-table";
import { mockStudents, mockClasses, mockAssignments, mockGrades } from "@/lib/mock-data";

export default function TeacherGradebookPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gradebook</h1>
            <GradebookTable 
                students={mockStudents.filter(s => s.major === "Computer Science")}
                assignments={mockAssignments}
                grades={mockGrades}
                classes={mockClasses.filter(c => ['CS101', 'CS303'].includes(c.name))}
            />
        </div>
    );
}
