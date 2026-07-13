import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Review from "@/models/Review";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { id } = params;

    if (!id) {
      return error("Review ID is required");
    }

    try {
      const review = await Review.findOne({ _id: id }).select(
        "title description name date rating img updatedBy _id"
      );

      if (!review) {
        return error("Review not found", { status: 404 });
      }

      return success(review);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req, { params }) => {
    const { id } = params;

    if (!id) {
      return error("Review ID is required", { status: 400 });
    }

    try {
      const review = await Review.findById(id);
      if (!review) {
        return error("Review not found", { status: 404 });
      }

      await Review.findByIdAndDelete(id);
      return success("Review deleted successfully");
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);
