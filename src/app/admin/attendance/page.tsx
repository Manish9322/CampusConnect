
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Class, Student } from "@/lib/types";
import { BookCopy, Users, ChevronLeft, ChevronRight, X, GraduationCap } from "lucide-react";
import { ClassAttendanceModal } from "@/components/admin/class-attendance-modal";
import { useGetClassesQuery, useGetStudentsQuery, useGetTeachersQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ClassWithStudentDetails extends Class {
    teacher: string;
    studentCount: number;
    students: Student[];
}

const ClassCard = React.memo(({ classItem, onClick }: { classItem: ClassWithStudentDetails, onClick: (classItem: ClassWithStudentDetails) => void }) => {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
            onClick={() => onClick(classItem)}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookCopy className="h-5 w-5 text-primary" />
                    {classItem.name}
                </CardTitle>
                <CardDescription>Taught by {classItem.teacher}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{classItem.studentCount} Students</span>
                </div>
            </CardContent>
        </Card>
    );
});
ClassCard.displayName = 'ClassCard';


export default function AttendancePage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedClass, setSelectedClass] = React.useState<ClassWithStudentDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [teacherFilter, setTeacherFilter] = React.useState<string>('all');
    const [sortBy, setSortBy] = React.useState<string>('name');

    const { data: classes = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
    const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachersQuery(undefined);

    const isLoading = isLoadingClasses || isLoadingStudents;

    const classDetails: ClassWithStudentDetails[] = React.useMemo(() => {
        if (isLoading) return [];
        return classes.map((c: any) => {
            const teacherName = c.teacherId?.name || "N/A";
            // Handle both populated and non-populated classId
            const studentsInClass = students.filter((s: Student) => {
                const studentClassId = typeof s.classId === 'object' && s.classId !== null 
                    ? (s.classId as any)._id 
                    : s.classId;
                return studentClassId === c._id;
            });
            return {
                ...c,
                teacher: teacherName,
                studentCount: studentsInClass.length,
                students: studentsInClass,
            };
        });
    }, [classes, students, isLoading]);

    // Get unique teachers for filter
    const uniqueTeachers = React.useMemo(() => {
        const teacherSet = new Set(classDetails.map(c => c.teacher));
        return Array.from(teacherSet).filter(t => t !== 'N/A');
    }, [classDetails]);

    // Filter and sort classes
    const filteredClasses = React.useMemo(() => {
        let filtered = classDetails.filter(c =>
            (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.teacher.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (teacherFilter === 'all' || c.teacher === teacherFilter)
        );

        // Sort classes
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'teacher':
                    return a.teacher.localeCompare(b.teacher);
                case 'students':
                    return b.studentCount - a.studentCount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [classDetails, searchTerm, teacherFilter, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
    const paginatedClasses = filteredClasses.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setPage(0);
    };

    const isFiltered = searchTerm !== '' || teacherFilter !== 'all';

    const clearFilters = () => {
        setSearchTerm('');
        setTeacherFilter('all');
        setPage(0);
    };
    
    const handleClassClick = React.useCallback((classItem: ClassWithStudentDetails) => {
        setSelectedClass(classItem);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = React.useCallback((open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            // Delay clearing the selected class to allow the modal to animate out
            setTimeout(() => setSelectedClass(null), 200);
        }
    }, []);

    const renderClassGrid = () => {
        if (isLoading) {
            return (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-5 w-1/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
        }

        if (paginatedClasses.length === 0) {
            return (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Classes Found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {isFiltered 
                                ? "No classes match your current filters." 
                                : "There are no classes available."}
                        </p>
                        {isFiltered && (
                            <Button variant="outline" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4" /> Clear Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedClasses.map(c => (
                   <ClassCard key={c._id} classItem={c} onClick={handleClassClick} />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Attendance Management</h1>
                <Badge variant="outline" className="text-base">
                    {filteredClasses.length} {filteredClasses.length === 1 ? 'Class' : 'Classes'}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select a Class</CardTitle>
                    <CardDescription>
                        Click on a class to view and manage student attendance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Search for a class or teacher..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0);
                            }}
                            className="flex-1"
                        />
                        <Select value={teacherFilter} onValueChange={(value) => {
                            setTeacherFilter(value);
                            setPage(0);
                        }}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {uniqueTeachers.map((teacher) => (
                                    <SelectItem key={teacher} value={teacher}>
                                        {teacher}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="students">Student Count</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active Filters */}
                    {isFiltered && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {searchTerm && (
                                <Badge variant="secondary">
                                    Search: {searchTerm}
                                </Badge>
                            )}
                            {teacherFilter !== 'all' && (
                                <Badge variant="secondary">
                                    Teacher: {teacherFilter}
                                </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4" /> Clear All
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {renderClassGrid()}

            {/* Pagination */}
            {!isLoading && filteredClasses.length > 0 && (
                <Card>
                    <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Classes per page</span>
                            <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue placeholder={`${rowsPerPage}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="8">8</SelectItem>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="16">16</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                                Page {page + 1} of {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedClass && (
                <ClassAttendanceModal
                    key={selectedClass._id}
                    isOpen={isModalOpen}
                    onOpenChange={handleCloseModal}
                    classData={selectedClass}
                />
            )}
        </div>
    );
}

    