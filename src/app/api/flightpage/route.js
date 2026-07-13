import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import FlightPage from "@/models/FlightPage";
import Airline from "@/models/Airline";

// Create FlightPage (POST)
export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    try {
      const {
        title,
        metaDescription,
        content,
        airline,
        routPath,
        metaKeywords,
        metaTitle,
        smallContent,
        isActive,
        faqs,
        links,
        cabins,
        mediaBlocks,
        imgageAlt,
        thumbnail,
        language,
      } = await req.json();

      const userId = req?.user?.userId;

      if (
        !title ||
        !airline ||
        !routPath ||
        !metaTitle ||
        !metaDescription ||
        !content ||
        !language ||
        !smallContent
      ) {
        return error("Missing required fields", { status: 400 });
      }

      const existingFlightPage = await FlightPage.findOne({ routPath ,language});
      if (existingFlightPage) {
        return error("FlightPage with this route already exists", {
          status: 400,
        });
      }

      const currentAirline = await Airline.findById(airline);
      if (!currentAirline) {
        return error("Airline not found", { status: 400 });
      }

      const formattedFaqs = Array.isArray(faqs)
        ? faqs.filter((f) => f?.question && f?.answer) // keep only valid ones
        : [];

      const formattedlinks = Array.isArray(links)
        ? links.filter((t) => t?.label && t?.url) // keep only valid ones
        : [];

      const formattedCabins = Array.isArray(cabins)
        ? cabins.filter((c) => c?.cabin) // keep only valid ones
        : [];

      const formattedMediaBlocks = Array.isArray(mediaBlocks)
        ? mediaBlocks.filter((m) => m?.heading || m?.text || m?.image) // keep only valid ones
        : [];

      const newFlightPage = new FlightPage({
        title,
        metaDescription,
        content,
        createdBy: userId,
        airline,
        metaKeywords,
        routPath,
        metaTitle,
        smallContent,
        isActive,
        imgageAlt,
        thumbnail,
        faqs: formattedFaqs,
        links: formattedlinks,
        cabins: formattedCabins,
        mediaBlocks: formattedMediaBlocks,
        language,
      });

      await newFlightPage.save();

      return success("FlightPage created successfully", {
        status: 201,
        data: newFlightPage,
      });
    } catch (err) {
      console.error("Error creating FlightPage:", err);
      return error("Internal Server Error", { status: 500 });
    }
  }),
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      _id,
      title,
      metaDescription,
      content,
      airline,
      routPath,
      metaKeywords,
      metaTitle,
      imgageAlt,
      thumbnail,
      smallContent,
      isActive,
      faqs,
      links,
      cabins,
      mediaBlocks,
      language,
    } = await req.json();

    try {
      const updatedBy = req?.user?.userId;
      const role = req?.user?.role;

      if (!routPath) {
        return error("Missing route", { status: 400 });
      }

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      const existingFlightPage =
        await FlightPage.findById(_id).populate("content");
      if (!existingFlightPage) {
        return error("FlightPage not found", { status: 404 });
      }

      existingFlightPage.title = title;
      existingFlightPage.thumbnail = thumbnail;
      existingFlightPage.metaDescription = metaDescription;
      existingFlightPage.metaKeywords = metaKeywords;
      existingFlightPage.metaTitle = metaTitle;
      existingFlightPage.updatedBy = updatedBy;
      existingFlightPage.smallContent = smallContent;
      existingFlightPage.imgageAlt = imgageAlt;
      existingFlightPage.content = content;
      existingFlightPage.isActive = isActive;
      existingFlightPage.faqs = faqs;
      existingFlightPage.links = links;
      existingFlightPage.cabins = cabins;
      existingFlightPage.mediaBlocks = mediaBlocks;
      existingFlightPage.language = language;

      // ✅ Update routPath only if role is admin
      if (role === "admin") {
        existingFlightPage.routPath = routPath;
      }

      await existingFlightPage.save();

      return success("FlightPage updated successfully", existingFlightPage);
    } catch (err) {
      console.error("Error updating FlightPage:", err);
      return error("Internal Server Error");
    }
  }),
);

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    try {
      // Parse query parameters from URL
      const { searchParams } = new URL(req.url); // req.url exists in App Router
      const page = parseInt(searchParams.get("page")) || 1;
      const limit = parseInt(searchParams.get("limit")) || 25;
      const skip = (page - 1) * limit;

      const search = searchParams.get("search")?.trim();
      const filter = search
        ? { routPath: { $regex: search, $options: "i" } }
        : {};

      // Count total documents for pagination info
      const total = await FlightPage.countDocuments(filter);

      // Fetch paginated flight pages
      const flightPages = await FlightPage.find(
        filter,
        "title slug airline routPath isActive",
      )
        .sort({ createdAt: -1 })
        .populate("airline", "businessName iataCode")
        .skip(skip)
        .limit(limit);

      // Return paginated response
      return success({
        data: flightPages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("Error fetching FlightPages:", err);
      return error("Internal Server Error");
    }
  }),
);
