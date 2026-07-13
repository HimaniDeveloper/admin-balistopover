import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Popup from "@/models/Popup";

export const GET = dbMiddleware(
  authMiddleware(["admin"])(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      const popup = await Popup.findById(id);
      return new Response(JSON.stringify(popup), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Fetch failed" }), {
        status: 500,
      });
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin"])(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      const body = await req.json();

      const popup = await Popup.findByIdAndUpdate(id, body, {
        new: true,
      });
      return new Response(JSON.stringify(popup), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Update failed" }), {
        status: 500,
      });
    }
  })
);
