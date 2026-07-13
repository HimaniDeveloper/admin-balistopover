import mongoose from "mongoose";

const flightPageSchema = new mongoose.Schema(
  {
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airline",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
    },
    // metaTags: {
    //   type: String,
    //   required: true,
    // },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    smallContent: {
      type: String,
    },
    routPath: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
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
    links: [
      {
        label: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    cabins: [
      {
        cabin: {
          type: String,
        },
        bestFor: {
          type: String,
        },
        whatYouGet: {
          type: String,
        },
        fare: {
          type: String,
        },
      },
    ],
    mediaBlocks: [
      {
        image: {
          type: String,
        },
        imageAlt: {
          type: String,
        },
        heading: {
          type: String,
        },
        text: {
          type: String,
        },
      },
    ],
    imgageAlt: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    language: {
      type: String,
    },
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
  },
);

export default mongoose.models.FlightPage ||
  mongoose.model("FlightPage", flightPageSchema);
