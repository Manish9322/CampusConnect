
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { AnnouncementCategory } from '@/models/announcement-category.model.js';

export async function GET() {
  await _db();
  try {
    const categories = await AnnouncementCategory.find({});
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching announcement categories', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    
    // Check if it's an array (bulk insert)
    if (Array.isArray(body)) {
      const newCategories = await AnnouncementCategory.insertMany(body);
      return NextResponse.json({ 
        message: `${newCategories.length} announcement categories created successfully`,
        categories: newCategories 
      }, { status: 201 });
    }
    
    // Single insert
    const newCategory = new AnnouncementCategory(body);
    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating announcement category', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedCategory = await AnnouncementCategory.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedCategory) {
            return NextResponse.json({ message: 'Announcement category not found' }, { status: 404 });
        }
        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating announcement category', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedCategory = await AnnouncementCategory.findByIdAndDelete(id);
        if (!deletedCategory) {
            return NextResponse.json({ message: 'Announcement category not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Announcement category deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting announcement category', error: error.message }, { status: 400 });
    }
}
