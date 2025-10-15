
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Connection', 'Subject', 'Department', 'Designation', 'Teacher', 'Class', 'Student', 'Announcement', 'AnnouncementCategory', 'Attendance', 'Assignment', 'Grade', 'AttendanceRequest'],
  endpoints: (builder) => ({
    testDBConnection: builder.query({
      query: () => 'connect',
      providesTags: ['Connection'],
    }),
    updateConnection: builder.mutation({
        query: () => ({
            url: 'connect',
            method: 'POST',
        }),
        invalidatesTags: ['Connection'],
    }),

    // Subject CRUD endpoints
    getSubjects: builder.query({
      query: () => 'settings/subject',
      providesTags: ['Subject'],
    }),
    addSubject: builder.mutation({
      query: (newSubject) => ({
        url: 'settings/subject',
        method: 'POST',
        body: newSubject,
      }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation({
      query: (subjectToUpdate) => ({
        url: `settings/subject`,
        method: 'PUT',
        body: subjectToUpdate,
      }),
      invalidatesTags: ['Subject'],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `settings/subject?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),

    // Department CRUD endpoints
    getDepartments: builder.query({
        query: () => 'settings/department',
        providesTags: ['Department'],
    }),
    addDepartment: builder.mutation({
        query: (newDepartment) => ({
            url: 'settings/department',
            method: 'POST',
            body: newDepartment,
        }),
        invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation({
        query: (departmentToUpdate) => ({
            url: `settings/department`,
            method: 'PUT',
            body: departmentToUpdate,
        }),
        invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation({
        query: (id) => ({
            url: `settings/department?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Department'],
    }),

    // Designation CRUD endpoints
    getDesignations: builder.query({
        query: () => 'settings/designation',
        providesTags: ['Designation'],
    }),
    addDesignation: builder.mutation({
        query: (newDesignation) => ({
            url: 'settings/designation',
            method: 'POST',
            body: newDesignation,
        }),
        invalidatesTags: ['Designation'],
    }),
    updateDesignation: builder.mutation({
        query: (designationToUpdate) => ({
            url: `settings/designation`,
            method: 'PUT',
            body: designationToUpdate,
        }),
        invalidatesTags: ['Designation'],
    }),
    deleteDesignation: builder.mutation({
        query: (id) => ({
            url: `settings/designation?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Designation'],
    }),

    // Teacher CRUD endpoints
    getTeachers: builder.query({
        query: () => 'teachers',
        providesTags: ['Teacher'],
    }),
    addTeacher: builder.mutation({
        query: (newTeacher) => ({
            url: 'teachers',
            method: 'POST',
            body: newTeacher,
        }),
        invalidatesTags: ['Teacher'],
    }),
    updateTeacher: builder.mutation({
        query: (teacherToUpdate) => ({
            url: 'teachers',
            method: 'PUT',
            body: teacherToUpdate,
        }),
        invalidatesTags: ['Teacher', 'Class'],
    }),
    deleteTeacher: builder.mutation({
        query: (id) => ({
            url: `teachers?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Teacher'],
    }),

    // Class CRUD endpoints
    getClasses: builder.query({
        query: () => 'classes',
        providesTags: ['Class'],
    }),
    addClass: builder.mutation({
        query: (newClass) => ({
            url: 'classes',
            method: 'POST',
            body: newClass,
        }),
        invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation({
        query: (classToUpdate) => ({
            url: 'classes',
            method: 'PUT',
            body: classToUpdate,
        }),
        invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation({
        query: (id) => ({
            url: `classes?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Class'],
    }),

    // Student CRUD endpoints
    getStudents: builder.query({
      query: ({ classId } = {}) => classId ? `students?classId=${classId}` : 'students',
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Student', id: _id })), { type: 'Student', id: 'LIST' }]
          : [{ type: 'Student', id: 'LIST' }],
    }),
    addStudent: builder.mutation({
        query: (newStudent) => ({
            url: 'students',
            method: 'POST',
            body: newStudent,
        }),
        invalidatesTags: [{ type: 'Student', id: 'LIST' }, 'Class'],
    }),
    updateStudent: builder.mutation({
        query: (studentToUpdate) => ({
            url: 'students',
            method: 'PUT',
            body: studentToUpdate,
        }),
        invalidatesTags: (result, error, { _id }) => [{ type: 'Student', id: _id }, 'Class'],
    }),
    deleteStudent: builder.mutation({
        query: (id) => ({
            url: `students?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Student', id }, { type: 'Student', id: 'LIST' }, 'Class'],
    }),
    getAssignmentsForStudent: builder.query({
        query: (studentId) => `students/${studentId}/assignments`,
        providesTags: (result, error, studentId) => [{ type: 'Assignment', studentId }],
    }),

    // Announcement Category CRUD endpoints
    getAnnouncementCategories: builder.query({
        query: () => 'settings/announcement-category',
        providesTags: ['AnnouncementCategory'],
    }),
    addAnnouncementCategory: builder.mutation({
        query: (newCategory) => ({
            url: 'settings/announcement-category',
            method: 'POST',
            body: newCategory,
        }),
        invalidatesTags: ['AnnouncementCategory'],
    }),
    updateAnnouncementCategory: builder.mutation({
        query: (categoryToUpdate) => ({
            url: `settings/announcement-category`,
            method: 'PUT',
            body: categoryToUpdate,
        }),
        invalidatesTags: ['AnnouncementCategory'],
    }),
    deleteAnnouncementCategory: builder.mutation({
        query: (id) => ({
            url: `settings/announcement-category?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['AnnouncementCategory'],
    }),

    // Announcement CRUD endpoints
    getAnnouncements: builder.query({
        query: () => 'announcements',
        providesTags: ['Announcement'],
    }),
    addAnnouncement: builder.mutation({
        query: (newAnnouncement) => ({
            url: 'announcements',
            method: 'POST',
            body: newAnnouncement,
        }),
        invalidatesTags: ['Announcement'],
    }),
    updateAnnouncement: builder.mutation({
        query: (announcementToUpdate) => ({
            url: 'announcements',
            method: 'PUT',
            body: announcementToUpdate,
        }),
        invalidatesTags: ['Announcement'],
    }),
    deleteAnnouncement: builder.mutation({
        query: (id) => ({
            url: `announcements?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Announcement'],
    }),

    // Attendance endpoints
    getAttendance: builder.query({
        query: (params) => {
            const urlParams = new URLSearchParams();
            if (params.classId) urlParams.append('classId', params.classId);
            if (params.date) urlParams.append('date', params.date);
            return `attendance?${urlParams.toString()}`;
        },
        providesTags: (result, error, { classId, date }) => [{ type: 'Attendance', id: `${classId}-${date}` }],
    }),
    addAttendance: builder.mutation({
        query: (attendanceData) => ({
            url: 'attendance',
            method: 'POST',
            body: attendanceData,
        }),
        invalidatesTags: (result, error, arg) => {
            if (Array.isArray(arg) && arg.length > 0) {
                const { classId, date } = arg[0] || { classId: 'UNKNOWN', date: 'UNKNOWN' };
                return [{ type: 'Attendance', id: `${classId}-${date}` }];
            }
            return ['Attendance'];
        },
    }),

    // Assignment endpoints
    getAssignments: builder.query({
        query: (params) => `assignments${params?.courseId ? `?courseId=${params.courseId}`: ''}`,
        providesTags: ['Assignment'],
    }),
    addAssignment: builder.mutation({
        query: (newAssignment) => ({
            url: 'assignments',
            method: 'POST',
            body: newAssignment,
        }),
        invalidatesTags: ['Assignment'],
    }),
    updateAssignment: builder.mutation({
        query: (assignmentToUpdate) => ({
            url: 'assignments',
            method: 'PUT',
            body: assignmentToUpdate,
        }),
        invalidatesTags: ['Assignment'],
    }),
    deleteAssignment: builder.mutation({
        query: (id) => ({
            url: `assignments?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Assignment'],
    }),

    // Grade endpoints
    getGrades: builder.query({
        query: (studentId) => `grades${studentId ? `?studentId=${studentId}`: ''}`,
        providesTags: ['Grade'],
    }),
    addGrade: builder.mutation({
        query: (newGrade) => ({
            url: 'grades',
            method: 'POST',
            body: newGrade,
        }),
        invalidatesTags: ['Grade'],
    }),
    updateGrade: builder.mutation({
        query: (gradeToUpdate) => ({
            url: 'grades',
            method: 'PUT',
            body: gradeToUpdate,
        }),
        invalidatesTags: ['Grade'],
    }),

    // Attendance Request endpoints
    getAttendanceRequests: builder.query({
        query: () => 'attendance-requests',
        providesTags: ['AttendanceRequest'],
    }),
    addAttendanceRequest: builder.mutation({
        query: (newRequest) => ({
            url: 'attendance-requests',
            method: 'POST',
            body: newRequest,
        }),
        invalidatesTags: ['AttendanceRequest'],
    }),
    updateAttendanceRequest: builder.mutation({
        query: (requestToUpdate) => ({
            url: 'attendance-requests',
            method: 'PUT',
            body: requestToUpdate,
        }),
        invalidatesTags: ['AttendanceRequest', 'Attendance'],
    }),
  }),
});

export const { 
    useTestDBConnectionQuery, 
    useUpdateConnectionMutation,
    useGetSubjectsQuery,
    useAddSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useGetDepartmentsQuery,
    useAddDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useGetDesignationsQuery,
    useAddDesignationMutation,
    useUpdateDesignationMutation,
    useDeleteDesignationMutation,
    useGetTeachersQuery,
    useAddTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
    useGetClassesQuery,
    useAddClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
    useGetStudentsQuery,
    useAddStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
    useGetAssignmentsForStudentQuery,
    useGetAnnouncementCategoriesQuery,
    useAddAnnouncementCategoryMutation,
    useUpdateAnnouncementCategoryMutation,
    useDeleteAnnouncementCategoryMutation,
    useGetAnnouncementsQuery,
    useAddAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    useGetAttendanceQuery,
    useAddAttendanceMutation,
    useGetAssignmentsQuery,
    useAddAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
    useGetGradesQuery,
    useAddGradeMutation,
    useUpdateGradeMutation,
    useGetAttendanceRequestsQuery,
    useAddAttendanceRequestMutation,
    useUpdateAttendanceRequestMutation,
} = api;
