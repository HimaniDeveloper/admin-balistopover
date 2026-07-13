import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String
    },
    imgageAlt: {
      type: String,
    },
    metaTags: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String
    },
    routPath: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    tagline:  {
      type: String,
    },
    days:  {
      type: String,
    },
    price:  {
      type: Number,
    },
    offer:  {
      type: Number,
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

export default mongoose.models.Holiday || mongoose.model('Holiday', holidaySchema);
