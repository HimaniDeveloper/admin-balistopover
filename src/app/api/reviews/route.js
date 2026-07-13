import { URL } from "url";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import Review from "@/models/Review";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const { title, description, name, date, rating } = await req.json();
    const userId = req?.user?.userId;

    if (!title || !description || !name || !rating) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const reviewContent = new Review({
        title,
        description,
        name,
        date: date || new Date(),
        rating,
        createdBy: userId,
      });

      await reviewContent.save();
      return success("Review created successfully", { status: 201 });
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const { _id, title, description, name, date, rating } = await req.json();

    if (!_id) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const updatedBy = req?.user?.userId;

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      const updatedReview = await Review.findByIdAndUpdate(
        _id,
        {
          title,
          description,
          name,
          date,
          rating,
          updatedBy,
        },
        { new: true }
      );

      if (!updatedReview) {
        return error("Review not found", { status: 404 });
      }
      return success("Review updated successfully");
    } catch (err) {
      return error("Internal Server Error", err);
    }
  })
);

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, { query }) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const query = Object.fromEntries(parsedUrl.searchParams);
      const page = parseInt(query?.page) || 1;
      const limit = parseInt(query?.limit) || 10;
      const skip = (page - 1) * limit;

      const reviews = await Review.find({})
        .sort({ createdAt: -1 })
        .select("title description name date rating updatedBy _id")
        .skip(skip)
        .limit(limit);

      const total = await Review.countDocuments();

      return success({
        data: reviews,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);
