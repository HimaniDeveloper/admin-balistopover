import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
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
    routPath: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    thumbnail_public_id: {
      type: String,
    },

    destinationtype: {
      type: String,
      enum: ["domestic", "international", "trending"],
      default: "international", // optional default
    },

    // ---- destination detail fields (website detail page) ----
    country: {
      type: String,
    },
    startingPrice: {
      type: Number,
    },
    overview: [
      {
        type: String,
      },
    ],
    facts: {
      best: { type: String },
      flight: { type: String },
      currency: { type: String },
      language: { type: String },
      tz: { type: String },
      budget: { type: String },
      weather: { type: String },
    },
    beaches: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    areas: [
      {
        name: { type: String },
        tag: { type: String },
        description: { type: String },
      },
    ],
    thingsToDo: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    season: [
      {
        type: String,
        enum: ["peak", "shoulder", "rainy", ""],
      },
    ],
    cost: {
      flights: { type: Number },
      accom: { type: Number },
      food: { type: Number },
      transport: { type: Number },
      activities: { type: Number },
    },
    gallery: [
      {
        url: { type: String },
        public_id: { type: String },
        alt: { type: String },
      },
    ],

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

export default mongoose.models.Destination ||
  mongoose.model("Destination", destinationSchema);
