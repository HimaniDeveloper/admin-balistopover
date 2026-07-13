import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import { User } from "@/models";
import { error, success } from "@/utils/response";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = dbMiddleware(async (req, res) => {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return error("Token and new password required", { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return error("User not found", { status: 404 });

    user.password = newPassword;
    user.isDefaultPassword = false;
    await user.save();

    return success("Password has been reset successfully");
  } catch (err) {
    console.error("Invalid or expired token", err);
    return error("Invalid or expired token", { status: 400 });
  }
});
