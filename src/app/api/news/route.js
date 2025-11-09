import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { News } from '@/models/news.model';

export async function GET() {
  await _db();
  try {
    const news = await News.find({}).sort({ order: 1 });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching news', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      // Handle bulk creation
      const newsWithSlugs = body.map(item => ({
        ...item,
        slug: item.slug || item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      }));
      const newNewsItems = await News.insertMany(newsWithSlugs);
      return NextResponse.json({ 
        message: `${newNewsItems.length} news articles created successfully`,
        data: newNewsItems 
      }, { status: 201 });
    } else {
      // Handle single creation
       const lastNews = await News.findOne().sort({ order: -1 });
       const newOrder = lastNews ? lastNews.order + 1 : 0;
      const newNews = new News({...body, order: newOrder});
      await newNews.save();
      return NextResponse.json(newNews, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error creating news', error: error.message }, { status: 400 });
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
            await News.bulkWrite(bulkOps);
            return NextResponse.json({ message: 'News articles reordered successfully' }, { status: 200 });
        }

        const { _id, ...updateData } = body;
        const updatedNews = await News.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedNews) {
            return NextResponse.json({ message: 'News not found' }, { status: 404 });
        }
        return NextResponse.json(updatedNews, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating news', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
            return NextResponse.json({ message: 'News not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'News deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting news', error: error.message }, { status: 400 });
    }
}
