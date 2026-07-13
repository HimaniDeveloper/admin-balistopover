const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    authorDes: {
      type: String,
    },
    role: {
      type: String,
      default: "Travel Writer",
    },
    image: {
      type: String,
    },
    thumbnail_public_id: {
      type: String,
    },
    expertise: {
      type: [String],
      default: [],
    },
    social: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
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
  { timestamps: true },
);

// Auto-generate slug from authorName if missing
AuthorSchema.pre("validate", function (next) {
  if (!this.slug && this.authorName) {
    this.slug = this.authorName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);

// const mongoose = require("mongoose");

// const AuthorSchema = new mongoose.Schema(
//   {
//     authorName: {
//       type: String,
//     },
//     authorDes: {
//       type: String,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Author ||
//   mongoose.model("Author", AuthorSchema);
