import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      required: true,
    },
    imgageAlt: {
      type: String,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String,
    },
    description: {
      type: String,
    },
    routPath: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    thumbnail_public_id: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },

    faqs: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Deal || mongoose.model("Deal", dealSchema);
