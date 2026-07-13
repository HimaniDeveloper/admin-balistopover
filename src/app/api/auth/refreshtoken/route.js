import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import User from "@/models/User";
import { error, success } from "@/utils/response";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, setCookie } from "@/lib/jwt";

export const GET = dbMiddleware(async (req) => {
  try {
    const refreshToken = req.cookies.get('refreshToken');

    if (!refreshToken?.value) {
      return error("Refresh token missing", { status: 401 });
    }

    const decoded = await verifyRefreshToken(refreshToken?.value);

    if (!decoded) {
      return error("Invalid refresh token", { status: 403 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return error("User not found", { status: 404 });
    }

    const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
    const newRefreshToken = await generateRefreshToken({ userId: user._id, email: user.email, role: user.role });

    const headers = {
      'Set-Cookie': [
        setCookie('accessToken', accessToken, { maxAge: 60 * 15 }),
        setCookie('refreshToken', newRefreshToken, { maxAge: 60 * 60 * 24 * 7 }),
      ].join(', '),
    };

    return success('Token refreshed', { headers });
  } catch (err) {
    return error("Internal Server Error", { status: 500 });
  }
});
