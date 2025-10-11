import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Connection', 'Subject', 'Department', 'Designation', 'Teacher'],
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
} = api;
