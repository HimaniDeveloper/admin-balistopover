import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['about-us', 'privacy-policy', 'terms-conditions', 'refund-policy', 'site-map'],
    },
    metaTitle: {
      type: String
    },
    metaTags: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    metaKeywords: {
      type: String
    },
    content: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Page || mongoose.model('Page', pageSchema);
