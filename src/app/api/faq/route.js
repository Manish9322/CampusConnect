
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { FAQ } from '@/models/faq.model.js';

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approvedOnly');
    
    const filter = {};
    if (approvedOnly === 'true') {
      filter.approved = true;
    }

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching FAQs', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    // Assign a default order by putting it at the end
    const lastFaq = await FAQ.findOne().sort({ order: -1 });
    const newOrder = lastFaq ? lastFaq.order + 1 : 0;

    const newFaq = new FAQ({ ...body, order: newOrder });
    await newFaq.save();
    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating FAQ', error: error.message }, { status: 400 });
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
            await FAQ.bulkWrite(bulkOps);
            return NextResponse.json({ message: 'FAQs reordered successfully' }, { status: 200 });
        }

        // Handle single update
        const { _id, ...updateData } = body;
        const updatedFaq = await FAQ.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedFaq) {
            return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
        }
        return NextResponse.json(updatedFaq, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating FAQ(s)', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedFaq = await FAQ.findByIdAndDelete(id);
        if (!deletedFaq) {
            return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting FAQ', error: error.message }, { status: 400 });
    }
}
