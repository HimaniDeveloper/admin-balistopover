import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Author from "@/models/Author";
import cloudinary from "@/utils/cloudinary";
import { error, success } from "@/utils/response";
import mongoose from "mongoose";

// Helper to safely escape regex special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Helper to generate slug from a name
const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Helper to find author by ID, slug, or authorName (case-insensitive)
const findAuthorByIdentifier = async (identifier) => {
  if (!identifier) return null;

  // Step 1: If it's a valid MongoDB ObjectId, try by _id
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Author.findById(identifier);
    if (byId) return byId;
  }

  // Step 2: Try by slug (exact match, indexed, fast)
  let author = await Author.findOne({ slug: identifier });
  if (author) return author;

  // Step 3: Fallback — try by authorName (case-insensitive)
  author = await Author.findOne({
    authorName: { $regex: `^${escapeRegex(identifier)}$`, $options: "i" },
  });

  return author;
};

// GET — public, no auth (so the website can fetch it)
export const GET = dbMiddleware(async (req, { params }) => {
  try {
    const { slug } = await params;

    if (!slug || slug === "undefined") {
      return error("Identifier is required", { status: 400 });
    }

    const author = await findAuthorByIdentifier(slug);

    if (!author) {
      return error("Author not found", { status: 404 });
    }

    // Strip sensitive fields
    const { __v, updatedBy, createdBy, ...safeAuthor } = author.toObject();

    return success(safeAuthor);
  } catch (err) {
    console.error("Error fetching Author:", err);
    return error("Internal Server Error");
  }
});

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, { params }) => {
    try {
      const { slug } = await params;

      if (!slug || slug === "undefined") {
        return error("Identifier is required", { status: 400 });
      }

      const userId = req?.user?.userId;
      const body = await req.json();

      // Step 1: Find author (id, slug, or name)
      const existing = await findAuthorByIdentifier(slug);
      if (!existing) {
        return error("Author not found", { status: 404 });
      }

      // Step 2: Auto-generate slug if missing (for legacy records)
      if (!existing.slug && !body.slug && existing.authorName) {
        body.slug = generateSlug(existing.authorName);
        console.log("ℹ️ Auto-generated slug for legacy record:", body.slug);
      }

      // Step 3: If image was changed or removed, delete old Cloudinary image
      const oldPublicId = existing.thumbnail_public_id;
      const newPublicId = body.thumbnail_public_id || "";

      if (oldPublicId && oldPublicId !== newPublicId) {
        try {
          const result = await cloudinary.uploader.destroy(oldPublicId);
          console.log("✅ Old Cloudinary image deleted:", oldPublicId, result);
        } catch (err) {
          console.warn("⚠️ Old image cleanup failed:", err.message);
        }
      }

      // Step 4: Update by _id (works regardless of how we found the author)
      const updated = await Author.findByIdAndUpdate(
        existing._id,
        { ...body, updatedBy: userId },
        { new: true, runValidators: true },
      ).select("-__v");

      if (!updated) {
        return error("Author not found", { status: 404 });
      }

      return success(updated, { status: 200 });
    } catch (err) {
      console.error("Error updating Author:", err);

      // Handle duplicate slug error gracefully
      if (err.code === 11000) {
        return error("An author with this slug already exists", {
          status: 409,
        });
      }

      return error("Internal Server Error");
    }
  }),
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req, { params }) => {
    try {
      const { slug } = await params;

      if (!slug || slug === "undefined") {
        return error("Identifier is required", { status: 400 });
      }

      // Step 1: Find author (id, slug, or name)
      const author = await findAuthorByIdentifier(slug);
      if (!author) {
        return error("Author not found", { status: 404 });
      }

      console.log(
        "🗑️ Deleting author:",
        author.slug || author.authorName || author._id,
      );
      console.log("🖼️ thumbnail_public_id:", author.thumbnail_public_id);

      // Step 2: Delete Cloudinary image if exists
      if (author.thumbnail_public_id) {
        try {
          const result = await cloudinary.uploader.destroy(
            author.thumbnail_public_id,
          );
          console.log("✅ Cloudinary delete result:", result);
        } catch (err) {
          console.warn("⚠️ Cloudinary image delete failed:", err.message);
        }
      } else {
        console.log("ℹ️ No thumbnail_public_id, skipping Cloudinary delete");
      }

      // Step 3: Delete by _id (safest)
      await Author.findByIdAndDelete(author._id);
      console.log("✅ Author deleted from DB");

      return success("Author deleted successfully", { status: 200 });
    } catch (err) {
      console.error("Error deleting Author:", err);
      return error("Internal Server Error");
    }
  }),
);
