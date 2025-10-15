
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { AttendanceRequest } from '@/models/attendance-request.model.js';
import { Attendance } from '@/models/attendance.model.js';

export async function GET() {
  await _db();
  try {
    const requests = await AttendanceRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching attendance requests', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newRequest = new AttendanceRequest(body);
    await newRequest.save();
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating attendance request', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, status } = body;

        const updatedRequest = await AttendanceRequest.findByIdAndUpdate(_id, { status }, { new: true });

        if (!updatedRequest) {
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }

        // If the request is approved, update the original attendance record
        if (status === 'approved') {
            await Attendance.findByIdAndUpdate(updatedRequest.attendanceId, { status: updatedRequest.requestedStatus });
        }

        return NextResponse.json(updatedRequest, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating attendance request', error: error.message }, { status: 400 });
    }
}
