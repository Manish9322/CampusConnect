import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { News } from '@/models/news.model';
import { Comment } from '@/models/comment.model';

export async function GET(request, { params }) {
  await _db();
  try {
    // Find and atomically increment the visit count
    const newsItem = await News.findOneAndUpdate(
      { slug: params.slug },
      { $inc: { visitCount: 1 } },
      { new: true } // Return the updated document
    );

    if (!newsItem) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    const comments = await Comment.find({ newsId: newsItem._id, approved: true }).sort({ createdAt: -1 });

    // Fetch related news (excluding the current one)
    const relatedNews = await News.find({
      category: newsItem.category,
      _id: { $ne: newsItem._id },
    }).sort({ date: -1 }).limit(3);
    
    // Fetch most viewed news (for the new section)
    const trendingNews = await News.find({
      _id: { $ne: newsItem._id },
    }).sort({ visitCount: -1 }).limit(3);

    // Fetch all categories
    const categories = await News.distinct('category');
    
    return NextResponse.json({ newsItem, comments, relatedNews, trendingNews, categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching news', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    await _db();
    try {
        const { action } = await request.json();
        let update;
        if(action === 'like') {
            update = { $inc: { likes: 1 } };
        } else if(action === 'share') {
            update = { $inc: { shares: 1 } };
        } else {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }
        
        const updatedNews = await News.findOneAndUpdate({ slug: params.slug }, update, { new: true });
        if (!updatedNews) {
            return NextResponse.json({ message: 'News not found' }, { status: 404 });
        }
        return NextResponse.json(updatedNews, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error updating news', error: error.message }, { status: 400 });
    }
}
