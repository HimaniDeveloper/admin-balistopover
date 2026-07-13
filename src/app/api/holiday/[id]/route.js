import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Holiday from "@/models/Holiday";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { id } = params;

    if (!id) {
      return error("ID is required");
    }

    try {
      const holiday = await Holiday.findOne({ _id: id });
      if (!holiday) {
        return error("Holiday not found", { status: 404 });
      }

      return success(holiday);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const DELETE = dbMiddleware(authMiddleware(['admin'])(async (req, { params }) => {
  const { id } = params;

  if (!id) {
    return error('Holiday ID is required', { status: 400 });
  }

  try {
    const deletedHoliday = await Holiday.findByIdAndDelete(id);
    if (!deletedHoliday) {
      return error('Holiday not found', { status: 404 });
    }

    return success('Holiday deleted successfully');
  } catch (err) {
    return error('Internal Server Error');
  }
}));