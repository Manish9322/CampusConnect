
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { ContactSettings } from '@/models/contact-settings.model.js';

// GET the current contact settings
export async function GET() {
  await _db();
  try {
    let settings = await ContactSettings.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = await ContactSettings.create({
        email: 'contact@example.com',
        phone: '(123) 456-7890',
        address: '123 University Ave, Learnington, ED 54321',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.220141639535!2d-122.419415684681!3d37.77492957975817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c1f9fa5ab%3A0x8aa8b66e3b5e43f1!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1628795550269!5m2!1sen!2sus',
        socials: [
            { platform: 'Twitter', url: '#' },
            { platform: 'LinkedIn', url: '#' },
            { platform: 'GitHub', url: '#' },
        ]
      });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contact settings', error: error.message }, { status: 500 });
  }
}

// POST to create or update contact settings (upsert)
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const settings = await ContactSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating contact settings', error: error.message }, { status: 400 });
  }
}

    