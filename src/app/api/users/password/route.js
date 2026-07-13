import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import User from "@/models/User";


export const PUT = dbMiddleware(
  authMiddleware(["admin"])(async (req) => {
    ``
    try {
      const { id, password } = await req.json();
      console.log("id: ", id);
      console.log("password: ", password);
      if (!id || !password) {
        return error("Missing required fields", { status: 400 });
      }

      const user = await User.findById(id);
      if (!user) {
        return error("User not found", { status: 404 });
      }

      if (password.length < 8) {
        return error("Password must be at least 8 characters", { status: 400 });
      }


      user.password = password;
      user.isDefaultPassword = false;
      await user.save();

      return success("Password updated successfully");
    } catch (err) {
      console.error("Error updating password:", err);
      return error("Internal Server Error", { status: 500 });
    }
  })
);
