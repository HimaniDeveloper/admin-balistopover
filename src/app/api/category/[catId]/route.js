import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import { error, success } from "@/utils/response";
import Category from "@/models/category";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { catId } = params;

    if (!catId) {
      return error("Id is required");
    }

    try {
      const category = await Category.findOne({ _id: catId })

      if (!category) {
        return error("Category not found", { status: 404 });
      }

      return success(category);
    } catch (err) {
      return error("Internal Server Error");
    }
  }),
);
