import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
