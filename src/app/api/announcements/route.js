
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Announcement } from '@/models/announcement.model.js';

export async function GET() {
  await _db();
  try {
    const announcements = await Announcement.find({}).sort({ order: 1 });
    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching announcements', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const lastAnnouncement = await Announcement.findOne().sort({ order: -1 });
    const newOrder = lastAnnouncement ? lastAnnouncement.order + 1 : 0;
    const newAnnouncement = new Announcement({ ...body, order: newOrder });
    await newAnnouncement.save();
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating announcement', error: error.message }, { status: 400 });
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
            await Announcement.bulkWrite(bulkOps);
            return NextResponse.json({ message: 'Announcements reordered successfully' }, { status: 200 });
        }

        // Handle single update
        const { _id, ...updateData } = body;
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedAnnouncement) {
            return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
        }
        return NextResponse.json(updatedAnnouncement, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating announcement(s)', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
            return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Announcement deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting announcement', error: error.message }, { status: 400 });
    }
}
