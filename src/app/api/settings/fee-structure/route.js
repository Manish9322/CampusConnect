
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { FeeStructure } from '@/models/fee-structure.model.js';

export async function GET() {
  await _db();
  try {
    const feeStructure = await FeeStructure.find({}).sort({ name: 1 });
    return NextResponse.json(feeStructure, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching fee structure', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newFee = new FeeStructure(body);
    await newFee.save();
    return NextResponse.json(newFee, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Fee with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error creating fee structure item', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedFee = await FeeStructure.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedFee) {
            return NextResponse.json({ message: 'Fee structure item not found' }, { status: 404 });
        }
        return NextResponse.json(updatedFee, { status: 200 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Another fee with this name already exists' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Error updating fee structure item', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedFee = await FeeStructure.findByIdAndDelete(id);
        if (!deletedFee) {
            return NextResponse.json({ message: 'Fee structure item not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Fee structure item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting fee structure item', error: error.message }, { status: 400 });
    }
}
