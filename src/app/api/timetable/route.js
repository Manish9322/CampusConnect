
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Timetable } from '@/models/timetable.model.js';
import { Class } from '@/models/class.model.js';

// GET - Fetch timetables
export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const day = searchParams.get('day');
    
    const filter = {};
    
    if (classId) {
      filter.classId = classId;
    }
    
    if (day) {
      filter.day = day;
    }
    
    const timetables = await Timetable.find(filter)
      .populate('classId', 'name year')
      .sort({ day: 1 });
    
    // Add className to each timetable
    const timetablesWithClassName = timetables.map(tt => {
      const ttObj = tt.toObject();
      ttObj.className = ttObj.classId?.name || 'Unknown Class';
      return ttObj;
    });
    
    return NextResponse.json(timetablesWithClassName, { status: 200 });
  } catch (error) {
    console.error('Error fetching timetables:', error);
    return NextResponse.json(
      { message: 'Error fetching timetables', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new timetable entry
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.classId || !body.day) {
      return NextResponse.json(
        { message: 'classId and day are required' },
        { status: 400 }
      );
    }
    
    // Verify class exists
    const classExists = await Class.findById(body.classId);
    if (!classExists) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }
    
    // Check if timetable already exists for this class and day
    const existing = await Timetable.findOne({
      classId: body.classId,
      day: body.day
    });
    
    if (existing) {
      return NextResponse.json(
        { message: 'Timetable already exists for this class and day. Use PUT to update.' },
        { status: 409 }
      );
    }
    
    const newTimetable = new Timetable(body);
    await newTimetable.save();
    
    const populatedTimetable = await Timetable.findById(newTimetable._id)
      .populate('classId', 'name year');
    
    const ttObj = populatedTimetable.toObject();
    ttObj.className = ttObj.classId?.name || 'Unknown Class';
    
    return NextResponse.json(ttObj, { status: 201 });
  } catch (error) {
    console.error('Error creating timetable:', error);
    return NextResponse.json(
      { message: 'Error creating timetable', error: error.message },
      { status: 400 }
    );
  }
}

// PUT - Update timetable
export async function PUT(request) {
  await _db();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { message: 'Timetable ID is required' },
        { status: 400 }
      );
    }
    
    const updatedTimetable = await Timetable.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    ).populate('classId', 'name year');
    
    if (!updatedTimetable) {
      return NextResponse.json(
        { message: 'Timetable not found' },
        { status: 404 }
      );
    }
    
    const ttObj = updatedTimetable.toObject();
    ttObj.className = ttObj.classId?.name || 'Unknown Class';
    
    return NextResponse.json(ttObj, { status: 200 });
  } catch (error) {
    console.error('Error updating timetable:', error);
    return NextResponse.json(
      { message: 'Error updating timetable', error: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete timetable
export async function DELETE(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Timetable ID is required' },
        { status: 400 }
      );
    }
    
    const deletedTimetable = await Timetable.findByIdAndDelete(id);
    
    if (!deletedTimetable) {
      return NextResponse.json(
        { message: 'Timetable not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Timetable deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting timetable:', error);
    return NextResponse.json(
      { message: 'Error deleting timetable', error: error.message },
      { status: 400 }
    );
  }
}
