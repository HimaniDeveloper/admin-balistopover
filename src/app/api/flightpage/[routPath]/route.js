import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import FlightPage from "@/models/FlightPage";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { routPath } = params;

    if (!routPath) {
      return error("Rout is required");
    }

    try {
      const page = await FlightPage.findById({ _id: routPath });
      if (!page) {
        return error("Page not found", { status: 404 });
      }

      return success(page);
    } catch (err) {
      console.error("Error fetching page:", err);
      return error("Internal Server Error");
    }
  }),
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
      const page = await FlightPage.findOneAndUpdate(
        { routPath },
        {
          $set: {
            isActive,
          },
        },
      );
      if (!page) {
        return error("Page not found", { status: 404 });
      }

      return success(page);
    } catch (err) {
      console.error("Error fetching page:", err);
      return error("Internal Server Error");
    }
  }),
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req, { params }) => {
    const { routPath } = params;

    if (!routPath) {
      return error("Rout is required");
    }

    try {
      const deletedPage = await FlightPage.findOneAndDelete({ routPath });
      if (!deletedPage) {
        return error("Page not found", { status: 404 });
      }

      return success("Page deleted successfully");
    } catch (err) {
      return error("Internal Server Error");
    }
  }),
);
