import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import User from "@/models/User";
import { error, success } from "@/utils/response";
import {
  generateAccessToken,
  generateRefreshToken,
  setCookie,
} from "@/lib/jwt";

export const POST = dbMiddleware(async (req) => {
  try {
    const body = await req.json();
    const { username, password } = body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return error("user not found", { status: 401 });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return error("Invalid credentials", { status: 401 });
    }

    if (!user.isActive) {
      return error("User blocked", { status: 401 });
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await generateRefreshToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const headers = {
      "Set-Cookie": [
        setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 }),
        setCookie("refreshToken", refreshToken, { maxAge: 60 * 60 * 24 }),
      ].join(", "),
    };

    return success("Login successful", { headers });
  } catch (err) {
    return error("Internal Server Error");
  }
});
