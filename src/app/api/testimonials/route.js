
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Testimonial } from '@/models/testimonial.model.js';

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approvedOnly');
    
    const filter = {};
    if (approvedOnly === 'true') {
      filter.approved = true;
    }

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching testimonials', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newTestimonial = new Testimonial(body);
    await newTestimonial.save();
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating testimonial', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedTestimonial) {
            return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
        }
        return NextResponse.json(updatedTestimonial, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating testimonial', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
        if (!deletedTestimonial) {
            return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Testimonial deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting testimonial', error: error.message }, { status: 400 });
    }
}
