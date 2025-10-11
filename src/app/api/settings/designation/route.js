import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Designation } from '@/models/designation.model.js';

export async function GET() {
  await _db();
  try {
    const designations = await Designation.find({});
    return NextResponse.json(designations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching designations', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newDesignation = new Designation(body);
    await newDesignation.save();
    return NextResponse.json(newDesignation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating designation', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedDesignation = await Designation.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedDesignation) {
            return NextResponse.json({ message: 'Designation not found' }, { status: 404 });
        }
        return NextResponse.json(updatedDesignation, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating designation', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedDesignation = await Designation.findByIdAndDelete(id);
        if (!deletedDesignation) {
            return NextResponse.json({ message: 'Designation not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Designation deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting designation', error: error.message }, { status: 400 });
    }
}
