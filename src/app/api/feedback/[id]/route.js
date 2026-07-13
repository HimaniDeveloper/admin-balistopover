import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Feedback from "@/models/Feedback";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { id } = params;

    if (!id) {
      return error("Id is required");
    }

    try {
      const feedback = await Feedback.findOne({ _id: id });
      if (!feedback) {
        return error("Feedback not found", { status: 404 });
      }

      return success(feedback);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const DELETE = dbMiddleware(authMiddleware(['admin'])(async (req, { params }) => {
  const { id } = params;

  if (!id) {
    return error('Feedback id is required', { status: 400 });
  }

  try {
    const feedbackPage = await Feedback.findById(id);
    if (!feedbackPage) {
      return error('Feedback not found', { status: 404 });
    }

    await Feedback.findByIdAndDelete(id);
    return success('Feedback deleted successfully');
  } catch (err) {
    return error('Internal Server Error');
  }
}));