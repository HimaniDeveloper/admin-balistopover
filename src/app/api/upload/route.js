import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Blog from "@/models/BlogPage";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import { v2 as cloudinaryPack } from "cloudinary";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req) => {
    try {
      const data = await req.formData();
      const file = data.get("file");

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blogs" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      return NextResponse.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req) => {
    try {
      const data = await req.formData();
      const file = data.get("file");
      const old_public_id = data.get("old_public_id");

      if (!file) {
        return NextResponse.json(
          { error: "Missing file" },
          { status: 400 }
        );
      }

      // ✅ Step 1: Upload new image first
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const updateResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blogs" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      // ✅ Step 2: Delete old image only after new upload is successful
      if (old_public_id) {
        try {
          await cloudinary.uploader.destroy(old_public_id);
        } catch (err) {
          console.warn("Old image deletion failed:", err.message);
        }
      }

      return NextResponse.json({
        url: updateResult.secure_url,
        public_id: updateResult.public_id,
      });
    } catch (err) {
      console.error("Error updating thumbnail:", err);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  })
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req) => {
    try {
      const { thumbnail_public_id } = await req.json();

      if (!thumbnail_public_id) {
        return NextResponse.json(
          { error: "thumbnail_public_id is required" },
          { status: 400 }
        );
      }

      try {
        const result = await cloudinaryPack.uploader.destroy(thumbnail_public_id);
        console.log("Cloudinary delete result:", result);

        return NextResponse.json(
          { message: "Thumbnail deleted successfully", result },
          { status: 200 }
        );
      } catch (err) {
        console.warn("Cloudinary delete failed:", err.message);
        return NextResponse.json(
          { error: "Failed to delete image from Cloudinary" },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("Error deleting thumbnail:", err);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  })
);

