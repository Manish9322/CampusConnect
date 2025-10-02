// This file was created as requested.
// In a Next.js App Router project, you can create API endpoints by adding a route.js or route.ts file.
// This example demonstrates a simple GET request handler.

import { NextResponse } from 'next/server';

export async function GET(request) {
  // In a real scenario, you would perform your database connection test here.
  // For now, this will return a success message.
  return NextResponse.json({ message: 'API connection successful' });
}
