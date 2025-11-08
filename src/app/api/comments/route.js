import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Comment } from '@/models/comment.model.js';

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newComment = new Comment(body);
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating comment', error: error.message }, { status: 400 });
  }
}
