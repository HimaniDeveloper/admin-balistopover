import mongoose from 'mongoose';

const blogContentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BlogContent || mongoose.model('BlogContent', blogContentSchema);
