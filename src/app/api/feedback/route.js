import { URL } from "url";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import Feedback from "@/models/Feedback";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const { name, description, img } = await req.json();
    const userId = req?.user?.userId;

    if (!name || !description) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const feedbckContent = new Feedback({
        name,
        description,
        img,
        createdBy: userId,
      });

      await feedbckContent.save();
      return success("Feedback created successfully", { status: 201 });
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const { _id, name, description, img } = await req.json();

    if (!_id) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const updatedBy = req?.user?.userId;

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      const updatedFeedback = await Feedback.findByIdAndUpdate(
        _id,
        {
          name,
          description,
          img,
          updatedBy,
        },
        { new: true }
      );

      if (!updatedFeedback) {
        return error("Feedback not found", { status: 404 });
      }
      return success("Feedback updated successfully");
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

      const feedbacks = await Feedback.find({})
        .sort({ createdAt: -1 })
        .select("name description img updatedBy _id")
        .skip(skip)
        .limit(limit);

      const total = await Feedback.countDocuments();

      return success({
        data: feedbacks,
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
