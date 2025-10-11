
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Connection', 'Subject', 'Department', 'Designation', 'Teacher', 'Class', 'Student', 'Announcement', 'AnnouncementCategory'],
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
        invalidatesTags: ['Teacher'],
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

    // Students endpoint - for now just a getter for the card
    getStudents: builder.query({
      query: () => 'students', // Assuming you'll create this endpoint
      providesTags: ['Student'],
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
    useGetAnnouncementCategoriesQuery,
    useAddAnnouncementCategoryMutation,
    useUpdateAnnouncementCategoryMutation,
    useDeleteAnnouncementCategoryMutation,
    useGetAnnouncementsQuery,
    useAddAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
} = api;
