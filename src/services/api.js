// This file was created to manage RTK Query endpoints as requested.
// The standard architecture for this project uses Next.js Server Components and Server Actions for data fetching and mutations, not RTK Query.
// This file is not currently integrated with the rest of the application.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config/config';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getExample: builder.query({
      query: (name) => `example/${name}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExampleQuery } = api;
