
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { ContactInquiry } from '@/models/contact-inquiry.model.js';

export async function GET(request) {
  await _db();
  try {
    const inquiries = await ContactInquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inquiries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching inquiries', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newInquiry = new ContactInquiry(body);
    await newInquiry.save();
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating inquiry', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedInquiry = await ContactInquiry.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedInquiry) {
            return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
        }
        return NextResponse.json(updatedInquiry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating inquiry', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedInquiry = await ContactInquiry.findByIdAndDelete(id);
        if (!deletedInquiry) {
            return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Inquiry deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting inquiry', error: error.message }, { status: 400 });
    }
}
