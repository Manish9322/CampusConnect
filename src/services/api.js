import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Connection', 'Subject'],
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
  }),
});

export const { 
    useTestDBConnectionQuery, 
    useUpdateConnectionMutation,
    useGetSubjectsQuery,
    useAddSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
} = api;
