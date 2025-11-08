

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Connection', 'Subject', 'Department', 'Designation', 'Teacher', 'Class', 'Student', 'Announcement', 'AnnouncementCategory', 'Attendance', 'Assignment', 'Grade', 'AttendanceRequest', 'Note', 'Timetable', 'Settings', 'Complaint', 'FeeName', 'FeeStructure', 'FeeSettings', 'StudentFeeSettings', 'AcademicYear', 'Testimonial', 'News', 'Comment'],
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
      query: (params = {}) => {
        const urlParams = new URLSearchParams();
        if (params.classId) urlParams.append('classId', params.classId);
        if (params.includeAttendance) urlParams.append('includeAttendance', params.includeAttendance);
        return `students?${urlParams.toString()}`;
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Student', id: 'LIST' },
        ...result.map(({ _id }) => ({ type: 'Student', id: _id })),
      ],
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
            if (params.studentId) urlParams.append('studentId', params.studentId);
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
        query: (params) => `assignments${params?.subjectId ? `?subjectId=${params.subjectId}`: ''}`,
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

    // Dashboard Stats
    getDashboardStats: builder.query({
        query: () => 'dashboard/stats',
        providesTags: ['Student', 'Teacher', 'Class', 'Subject', 'Attendance'],
    }),

    // Note endpoints
    getNotes: builder.query({
        query: (params = {}) => {
            const urlParams = new URLSearchParams();
            if (params.studentId) urlParams.append('studentId', params.studentId);
            if (params.isRead !== undefined && params.isRead !== null) urlParams.append('isRead', params.isRead);
            if (params.priority) urlParams.append('priority', params.priority);
            if (params.category) urlParams.append('category', params.category);
            if (params.limit) urlParams.append('limit', params.limit);
            return `notes?${urlParams.toString()}`;
        },
        providesTags: (result = []) => [
            { type: 'Note', id: 'LIST' },
            ...result.map(({ _id }) => ({ type: 'Note', id: _id })),
        ],
    }),
    addNote: builder.mutation({
        query: (newNote) => ({
            url: 'notes',
            method: 'POST',
            body: newNote,
        }),
        invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
    updateNote: builder.mutation({
        query: (noteToUpdate) => ({
            url: 'notes',
            method: 'PUT',
            body: noteToUpdate,
        }),
        invalidatesTags: (result, error, { _id }) => [{ type: 'Note', id: _id }, { type: 'Note', id: 'LIST' }],
    }),
    deleteNote: builder.mutation({
        query: (id) => ({
            url: `notes?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    // Timetable endpoints
    getTimetable: builder.query({
        query: (params = {}) => {
            const urlParams = new URLSearchParams();
            if (params.classId) urlParams.append('classId', params.classId);
            if (params.day) urlParams.append('day', params.day);
            return `timetable?${urlParams.toString()}`;
        },
        providesTags: (result = []) => [
            { type: 'Timetable', id: 'LIST' },
            ...result.map(({ _id }) => ({ type: 'Timetable', id: _id })),
        ],
    }),
    addTimetable: builder.mutation({
        query: (newTimetable) => ({
            url: 'timetable',
            method: 'POST',
            body: newTimetable,
        }),
        invalidatesTags: [{ type: 'Timetable', id: 'LIST' }],
    }),
    updateTimetable: builder.mutation({
        query: (timetableToUpdate) => ({
            url: 'timetable',
            method: 'PUT',
            body: timetableToUpdate,
        }),
        invalidatesTags: (result, error, { _id }) => [{ type: 'Timetable', id: _id }, { type: 'Timetable', id: 'LIST' }],
    }),
    deleteTimetable: builder.mutation({
        query: (id) => ({
            url: `timetable?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Timetable', id: 'LIST' }],
    }),

    // Settings endpoints
    getPeriodsPerDay: builder.query({
        query: ({ classId }) => `settings/periods-per-day?classId=${classId}`,
        providesTags: (result, error, { classId }) => [{ type: 'Settings', id: classId }],
    }),
    updatePeriodsPerDay: builder.mutation({
        query: ({ periodsPerDay, classId }) => ({
            url: 'settings/periods-per-day',
            method: 'PUT',
            body: { periodsPerDay, classId },
        }),
        invalidatesTags: (result, error, { classId }) => [{ type: 'Settings', id: classId }],
    }),
    
    // Complaint endpoints
    getComplaints: builder.query({
        query: (params = {}) => {
            const urlParams = new URLSearchParams();
            if (params.studentId) urlParams.append('studentId', params.studentId);
            return `complaints?${urlParams.toString()}`;
        },
        providesTags: ['Complaint'],
    }),
    addComplaint: builder.mutation({
        query: (newComplaint) => ({
            url: 'complaints',
            method: 'POST',
            body: newComplaint,
        }),
        invalidatesTags: ['Complaint'],
    }),
    updateComplaint: builder.mutation({
        query: (complaintToUpdate) => ({
            url: 'complaints',
            method: 'PUT',
            body: complaintToUpdate,
        }),
        invalidatesTags: ['Complaint'],
    }),

    // Fee Name Master endpoints
    getFeeNames: builder.query({
        query: () => 'settings/fee-name',
        providesTags: ['FeeName'],
    }),
    addFeeName: builder.mutation({
        query: (newFeeName) => ({
            url: 'settings/fee-name',
            method: 'POST',
            body: newFeeName,
        }),
        invalidatesTags: ['FeeName'],
    }),
    updateFeeName: builder.mutation({
        query: (feeNameToUpdate) => ({
            url: 'settings/fee-name',
            method: 'PUT',
            body: feeNameToUpdate,
        }),
        invalidatesTags: ['FeeName'],
    }),
    deleteFeeName: builder.mutation({
        query: (id) => ({
            url: `settings/fee-name?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['FeeName'],
    }),

    // Fee Structure endpoints
    getFeeStructure: builder.query({
        query: () => 'settings/fee-structure',
        providesTags: ['FeeStructure'],
    }),
    addFeeStructure: builder.mutation({
        query: (newFee) => ({
            url: 'settings/fee-structure',
            method: 'POST',
            body: newFee,
        }),
        invalidatesTags: ['FeeStructure'],
    }),
    updateFeeStructure: builder.mutation({
        query: (feeToUpdate) => ({
            url: 'settings/fee-structure',
            method: 'PUT',
            body: feeToUpdate,
        }),
        invalidatesTags: ['FeeStructure'],
    }),
    deleteFeeStructure: builder.mutation({
        query: (id) => ({
            url: `settings/fee-structure?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['FeeStructure'],
    }),

    // Fee Settings endpoints
    getFeeSettings: builder.query({
        query: () => 'settings/fee-settings',
        providesTags: ['FeeSettings'],
    }),
    updateFeeSettings: builder.mutation({
        query: (settings) => ({
            url: 'settings/fee-settings',
            method: 'POST',
            body: settings,
        }),
        invalidatesTags: ['FeeSettings'],
    }),

     // Student Fee Settings endpoints
    getStudentFeeSettings: builder.query({
        query: (params = {}) => {
            const urlParams = new URLSearchParams();
            if (params.studentId) urlParams.append('studentId', params.studentId);
            return `settings/student-fee-settings?${urlParams.toString()}`;
        },
        providesTags: ['StudentFeeSettings'],
    }),
    updateStudentFeeSettings: builder.mutation({
        query: (settings) => ({
            url: 'settings/student-fee-settings',
            method: 'POST',
            body: settings,
        }),
        invalidatesTags: ['StudentFeeSettings'],
    }),
    applyFeeSettingsToAll: builder.mutation({
        query: () => ({
            url: 'settings/apply-to-all-students',
            method: 'POST',
        }),
        invalidatesTags: ['StudentFeeSettings'],
    }),

    // Academic Year Settings
    getAcademicYearSettings: builder.query({
        query: () => 'settings/academic-year',
        providesTags: ['AcademicYear'],
    }),
    updateAcademicYearSettings: builder.mutation({
        query: (settings) => ({
            url: 'settings/academic-year',
            method: 'POST',
            body: settings,
        }),
        invalidatesTags: ['AcademicYear'],
    }),

    // Testimonial endpoints
    getTestimonials: builder.query({
        query: (params = {}) => {
          const urlParams = new URLSearchParams();
          if (params.approvedOnly) urlParams.append('approvedOnly', 'true');
          return `testimonials?${urlParams.toString()}`;
        },
        providesTags: ['Testimonial'],
    }),
    addTestimonial: builder.mutation({
        query: (newTestimonial) => ({
            url: 'testimonials',
            method: 'POST',
            body: newTestimonial,
        }),
        invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation({
        query: (testimonialToUpdate) => ({
            url: 'testimonials',
            method: 'PUT',
            body: testimonialToUpdate,
        }),
        invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation({
        query: (id) => ({
            url: `testimonials?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Testimonial'],
    }),
    
    // News endpoints
    getNews: builder.query({
      query: () => 'news',
      providesTags: ['News'],
    }),
    getNewsItem: builder.query({
      query: (slug) => `news/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'News', id: slug }],
    }),
    addNews: builder.mutation({
      query: (newNews) => ({
        url: 'news',
        method: 'POST',
        body: newNews,
      }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation({
      query: (newsToUpdate) => ({
        url: 'news',
        method: 'PUT',
        body: newsToUpdate,
      }),
      invalidatesTags: ['News'],
    }),
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `news?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),
    updateNewsInteraction: builder.mutation({
      query: ({ slug, action }) => ({
        url: `news/${slug}`,
        method: 'PUT',
        body: { action },
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'News', id: slug }],
    }),

    // Comments endpoints
    addComment: builder.mutation({
      query: (newComment) => ({
        url: 'comments',
        method: 'POST',
        body: newComment,
      }),
      invalidatesTags: ['Comment'],
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
    useGetDashboardStatsQuery,
    useGetNotesQuery,
    useAddNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
    useGetTimetableQuery,
    useAddTimetableMutation,
    useUpdateTimetableMutation,
    useDeleteTimetableMutation,
    useGetPeriodsPerDayQuery,
    useUpdatePeriodsPerDayMutation,
    useGetComplaintsQuery,
    useAddComplaintMutation,
    useUpdateComplaintMutation,
    useGetFeeNamesQuery,
    useAddFeeNameMutation,
    useUpdateFeeNameMutation,
    useDeleteFeeNameMutation,
    useGetFeeStructureQuery,
    useAddFeeStructureMutation,
    useUpdateFeeStructureMutation,
    useDeleteFeeStructureMutation,
    useGetFeeSettingsQuery,
    useUpdateFeeSettingsMutation,
    useGetStudentFeeSettingsQuery,
    useUpdateStudentFeeSettingsMutation,
    useApplyFeeSettingsToAllMutation,
    useGetAcademicYearSettingsQuery,
    useUpdateAcademicYearSettingsMutation,
    useGetTestimonialsQuery,
    useAddTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
    useGetNewsQuery,
    useGetNewsItemQuery,
    useAddNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useUpdateNewsInteractionMutation,
    useAddCommentMutation,
} = api;

    
