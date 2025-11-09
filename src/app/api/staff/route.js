
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Staff } from '@/models/staff.model.js';

export async function GET() {
  await _db();
  try {
    const staff = await Staff.find({}).sort({ order: 1 });
    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching staff', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const lastStaff = await Staff.findOne().sort({ order: -1 });
    const newOrder = lastStaff ? lastStaff.order + 1 : 0;
    const newStaff = new Staff({ ...body, order: newOrder });
    await newStaff.save();
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating staff member', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();

        // Handle bulk reordering
        if (Array.isArray(body)) {
            const bulkOps = body.map(item => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: { $set: { order: item.order } }
                }
            }));
            await Staff.bulkWrite(bulkOps);
            return NextResponse.json({ message: 'Staff reordered successfully' }, { status: 200 });
        }
        
        const { _id, ...updateData } = body;
        const updatedStaff = await Staff.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedStaff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }
        return NextResponse.json(updatedStaff, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating staff member', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Staff member deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting staff member', error: error.message }, { status: 400 });
    }
}
