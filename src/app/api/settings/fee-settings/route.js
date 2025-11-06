
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { FeeSettings } from '@/models/fee-settings.model.js';

// GET the global fee settings
export async function GET() {
  await _db();
  try {
    let settings = await FeeSettings.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = await FeeSettings.create({ mode: 'Full Payment', installments: [] });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching fee settings', error: error.message }, { status: 500 });
  }
}

// POST or PUT (upsert) the global fee settings
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const settings = await FeeSettings.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating fee settings', error: error.message }, { status: 400 });
  }
}
