import { error } from "@/utils/response";
import { verifyAccessToken } from "@/lib/jwt";
import { getUserDetailsById } from "@/services/userService";

const authMiddleware = (requiredRole) => (handler) => async (req, res) => {
  try {
    const accessToken = req.cookies.get("accessToken");

    if (!accessToken || !accessToken?.value) {
      return error("Unauthorized", { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(accessToken?.value);
    } catch (err) {
      return error("Unauthorized: Invalid access token", { status: 401 });
    }

    const isTokenExpired = Date.now() >= decoded.exp * 1000;
    if (isTokenExpired) {
      return error("Unauthorized: Access token has expired", { status: 401 });
    }

    const user = await getUserDetailsById(decoded.userId);

    if (!user) {
      return error("Unauthorized: User not found", { status: 401 });
    }

    if (!user.isActive) {
      return error("Inactive user", { status: 401 });
    }

    if (decoded.email !== user.email) {
      return error("Unauthorized: Invalid user credentials", { status: 401 });
    }

    if (
      !decoded ||
      (decoded.role !== "admin" &&
        requiredRole &&
        !requiredRole.includes(decoded.role))
    ) {
      return error("Forbidden", { status: 403 });
    }

    req.user = decoded;
    return handler(req, res);
  } catch (err) {
    console.error("Authorization error:", err);
    return error("Unauthorized", { status: 401 });
  }
};

export default authMiddleware;
