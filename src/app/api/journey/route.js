
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Journey } from '@/models/journey.model.js';

export async function GET() {
  await _db();
  try {
    const journeyItems = await Journey.find({}).sort({ order: 1 });
    return NextResponse.json(journeyItems, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching journey items', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const lastItem = await Journey.findOne().sort({ order: -1 });
    const newOrder = lastItem ? lastItem.order + 1 : 0;
    const newItem = new Journey({ ...body, order: newOrder });
    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating journey item', error: error.message }, { status: 400 });
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
            await Journey.bulkWrite(bulkOps);
            return NextResponse.json({ message: 'Journey items reordered successfully' }, { status: 200 });
        }

        // Handle single update
        const { _id, ...updateData } = body;
        const updatedItem = await Journey.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedItem) {
            return NextResponse.json({ message: 'Journey item not found' }, { status: 404 });
        }
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating journey item(s)', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedItem = await Journey.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json({ message: 'Journey item not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Journey item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting journey item', error: error.message }, { status: 400 });
    }
}
