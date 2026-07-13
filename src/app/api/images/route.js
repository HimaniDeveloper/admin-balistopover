import { put, del } from "@vercel/blob";
import Image from "@/models/Image";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";

// Upload new image
export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req) => {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = req?.user?.userId;

    if (!file) {
      return error("No file uploaded", { status: 400 });
    }

    try {
      // Upload to Vercel Blob
      const { url } = await put(file.name, file, {
        access: "public",
      });

      // Save to MongoDB
      const newImage = new Image({
        url,
        name: file.name,
        size: file.size,
        contentType: file.type,
        createdBy: userId,
      });

      await newImage.save();

      return success("Image uploaded successfully", { url });
    } catch (err) {
      console.error("Error uploading image:", err);
      return error("Failed to upload image");
    }
  })
);

// Get all images
export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async () => {
    try {
      const images = await Image.find().sort({ createdAt: -1 });
      return success(images);
    } catch (err) {
      console.error("Error fetching images:", err);
      return error("Failed to fetch images");
    }
  })
);

// Delete image
export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req) => {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const _id = searchParams.get("_id");

    if (!url || !_id) {
      return error("Missing required parameters", { status: 400 });
    }

    try {
      // Delete from Vercel Blob
      await del(url);

      // Delete from MongoDB
      await Image.findByIdAndDelete(_id);

      return success("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      return error("Failed to delete image");
    }
  })
);
