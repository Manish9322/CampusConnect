import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Comment } from '@/models/comment.model.js';

export async function GET(request) {
  await _db();
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching comments', error: error.message }, { status: 500 });
  }
}

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

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedComment = await Comment.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedComment) {
            return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
        }
        return NextResponse.json(updatedComment, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating comment', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting comment', error: error.message }, { status: 400 });
    }
}
