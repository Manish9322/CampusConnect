
import mongoose from 'mongoose';

const announcementCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export const AnnouncementCategory = mongoose.models.AnnouncementCategory || mongoose.model('AnnouncementCategory', announcementCategorySchema);
