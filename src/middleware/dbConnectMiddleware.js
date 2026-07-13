import dbConnect from "@/utils/dbConnect";
import { error } from "@/utils/response";

export const dbMiddleware = (handler) => async (req, res) => {
  try {
    await dbConnect();
    return handler(req, res);
  } catch (e) {
    return error('Database connection error');
  }
};
