import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import { success, error } from "@/utils/response";

export const GET = dbMiddleware(async (req, tes) => {
  try {
    const con = process.env;
    return success(con);
  } catch (err) {
    return error("Internal Server Error");
  }
});
