import { NextResponse } from "next/server";
import Popup from "@/models/Popup";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";

export const POST = dbMiddleware(
  authMiddleware(["admin"])(async (req, res) => {
    try {
      const data = await req.json();
      console.log("data: ", data);

      // if (!data.category || !data.title || !data.description) {
      if (!data?.tfns) {
        return NextResponse.json(
          { error: "URL, title and description are required" },
          { status: 400 },
        );
      }

      //   // Connect to database if not connected
      //   await connectToDatabase();
      // const existingPopup = await Popup.findOne({ url: data.url });
      // if (existingPopup) {
      //   return NextResponse.json(
      //     { error: "Popup with this URL already exists" },
      //     { status: 409 } // Conflict
      //   );
      // }

      const popup = new Popup({
        category: data.category,
        // url: data.url,
        // title: data?.title,
        // description: data.description,
        // highLight: data.highLight,
        // pointer: data.pointer || [],
        tfns: data.tfns || [],
        isActive: data.isActive || false,
        activeRoute: data.activeRoute,
      });

      await popup.save();

      return NextResponse.json(popup, { status: 201 });
    } catch (error) {
      console.error("Error creating popup:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);

export const GET = dbMiddleware(
  authMiddleware(["admin"])(async (req, res) => {
    try {
      // Database connection is handled by dbMiddleware
      const { searchParams } = new URL(req.url);
      const searchTerm = searchParams.get("searchTerm") || "";
      console.log("searchTerm: ", searchTerm);

      const filter =
        searchTerm.trim() !== ""
          ? { url: { $regex: searchTerm, $options: "i" } }
          : {};

      const popups = await Popup.find(filter).sort({ createdAt: -1 });

      return NextResponse.json(popups);
    } catch (error) {
      console.error("Error fetching popup list:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
