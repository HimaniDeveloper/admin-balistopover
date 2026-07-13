import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import PopuplarPlaces from "@/models/PopuplarPlaces";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params, query }) => {
    const { routPath } = params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!routPath) {
      return error("Airline route path is required");
    }

    try {
      let destination;

      if (id) {
        destination = await PopuplarPlaces.findOne({ routPath, _id: id });
      } else {
        destination = await PopuplarPlaces.find({ routPath });
      }

      if (!destination) {
        return error("Place not found", { status: 404 });
      }

      return success(destination);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);


export const DELETE = dbMiddleware(authMiddleware(['admin'])(async (req, { params }) => {
  const {routPath } = params;

  if (!routPath) {
    return error("Id is required");
  }

  try {
    const deletedPage = await PopuplarPlaces.findByIdAndDelete(routPath);
    if (!deletedPage) {
      return error('Place details not found', { status: 404 });
    }

    return success('Place deleted successfully');
  } catch (err) {
    return error('Internal Server Error');
  }
}));