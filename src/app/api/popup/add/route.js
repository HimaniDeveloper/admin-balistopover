import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    try {
      // Parse query parameters from URL
      const { searchParams } = new URL(req.url); // req.url exists in App Router
      const page = parseInt(searchParams.get("page")) || 1;
      const limit = parseInt(searchParams.get("limit")) || 25;
      const skip = (page - 1) * limit;

      // Count total documents for pagination info
      const total = await FlightPage.countDocuments();

      // Fetch paginated flight pages
      const flightPages = await FlightPage.find(
        {},
        "title slug airline routPath isActive language",
      )
        .sort({ createdAt: -1 })
        .populate("airline", "businessName iataCode");

      // Return paginated response
      return success({
        data: flightPages,
        // pagination: {
        //   total,
        //   page,
        //   limit,
        //   totalPages: Math.ceil(total / limit),
        // },
      });
    } catch (err) {
      console.error("Error fetching FlightPages:", err);
      return error("Internal Server Error");
    }
  }),
);
