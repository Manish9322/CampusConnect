
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { FeeName } from '@/models/fee-name.model.js';

export async function GET() {
  await _db();
  try {
    const feeNames = await FeeName.find({}).sort({ name: 1 });
    return NextResponse.json(feeNames, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching fee names', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newFeeName = new FeeName(body);
    await newFeeName.save();
    return NextResponse.json(newFeeName, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Fee name already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error creating fee name', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedFeeName = await FeeName.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedFeeName) {
            return NextResponse.json({ message: 'Fee name not found' }, { status: 404 });
        }
        return NextResponse.json(updatedFeeName, { status: 200 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Another fee with this name already exists' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Error updating fee name', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedFeeName = await FeeName.findByIdAndDelete(id);
        if (!deletedFeeName) {
            return NextResponse.json({ message: 'Fee name not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Fee name deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting fee name', error: error.message }, { status: 400 });
    }
}
