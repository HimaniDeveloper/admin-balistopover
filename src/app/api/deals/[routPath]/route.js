import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Deal from "@/models/Deal";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { routPath } = params;

    if (!routPath) {
      return error("Path is required");
    }

    try {
      const deal = await Deal.findOne({ routPath });

      if (!deal) {
        return error("Deal not found", { status: 404 });
      }

      return success(deal);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req, { params }) => {
    const { routPath } = params;

    if (!routPath) {
      return error("Deal path is required", { status: 400 });
    }

    try {
      const dealPage = await Deal.findOne({ routPath });
      if (!dealPage) {
        return error("Deal not found", { status: 404 });
      }

    
      await Deal.findOneAndDelete({ routPath });
      return success("Deal deleted successfully");
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { routPath } = params;

    const { searchParams } = new URL(req.url); // req.url exists in App Router
    const isActive = searchParams.get("isActive");

    if (!routPath) {
      return error("Route is required");
    }

    try {
      const page = await Deal.findOneAndUpdate(
        { routPath },
        {
          $set: {
            isActive,
          },
        }
      );
      if (!page) {
        return error("Page not found", { status: 404 });
      }

      return success(page);
    } catch (err) {
      console.error("Error fetching page:", err);
      return error("Internal Server Error");
    }
  })
);