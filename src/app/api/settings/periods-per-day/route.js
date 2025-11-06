import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Settings } from '@/models/settings.model';

// GET /api/settings/periods-per-day?classId=xxx
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    
    if (!classId) {
      return NextResponse.json(
        { error: 'classId is required' },
        { status: 400 }
      );
    }
    
    const key = `periodsPerDay_${classId}`;
    let setting = await Settings.findOne({ key });
    
    // If no setting exists, create default
    if (!setting) {
      const defaultValue = {
        Monday: 8,
        Tuesday: 8,
        Wednesday: 8,
        Thursday: 8,
        Friday: 8,
        Saturday: 8,
      };
      
      setting = await Settings.create({
        key,
        value: defaultValue,
        description: `Number of periods for each day of the week for class ${classId}`,
      });
    }
    
    return NextResponse.json(setting.value);
  } catch (error) {
    console.error('Error fetching periods per day:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/periods-per-day
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { periodsPerDay, classId } = body;
    
    if (!classId) {
      return NextResponse.json(
        { error: 'classId is required' },
        { status: 400 }
      );
    }
    
    if (!periodsPerDay || typeof periodsPerDay !== 'object') {
      return NextResponse.json(
        { error: 'Invalid periodsPerDay data' },
        { status: 400 }
      );
    }
    
    // Validate that all days are present and values are valid
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (const day of validDays) {
      if (!periodsPerDay[day] || periodsPerDay[day] < 1 || periodsPerDay[day] > 15) {
        return NextResponse.json(
          { error: `Invalid period count for ${day}` },
          { status: 400 }
        );
      }
    }
    
    const key = `periodsPerDay_${classId}`;
    const setting = await Settings.findOneAndUpdate(
      { key },
      { 
        value: periodsPerDay,
        description: `Number of periods for each day of the week for class ${classId}`,
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(setting.value);
  } catch (error) {
    console.error('Error updating periods per day:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
