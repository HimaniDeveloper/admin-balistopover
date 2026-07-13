import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Destination from "@/models/Destination";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { id } = params;

    if (!id) {
      return error("ID is required");
    }

    try {
      const destination = await Destination.findOne({ routPath: id });
      if (!destination) {
        return error("Destination not found", { status: 404 });
      }

      return success(destination);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req, { params }) => {
    const { id } = params;

    if (!id) {
      return error("Destination ID is required", { status: 400 });
    }

    try {
      const deletedDestination = await Destination.findByIdAndDelete(id);
      if (!deletedDestination) {
        return error("Destination not found", { status: 404 });
      }

      return success("Destination deleted successfully");
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { id } = params;

    const { searchParams } = new URL(req.url); // req.url exists in App Router
    const isActive = searchParams.get("isActive");

    if (!id) {
      return error("Route is required");
    }

    try {
      const page = await Destination.findOneAndUpdate(
        { routPath: id },
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
