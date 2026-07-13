import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import { User } from "@/models";
import { error, success } from "@/utils/response";

export const POST = dbMiddleware(async (req, res) => {
  return success("Reset password link sent to your email", null, {
    status: 200,
  });
});
