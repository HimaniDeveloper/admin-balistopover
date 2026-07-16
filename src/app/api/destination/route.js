import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import Destination from "@/models/Destination";

// Normalize the website detail fields (clone + drop empty entries)
const buildDetailFields = ({
  country,
  startingPrice,
  overview,
  facts,
  highlights,
  beaches,
  areas,
  thingsToDo,
  season,
  cost,
  gallery,
}) => ({
  country: country || "",
  startingPrice:
    startingPrice === "" || startingPrice == null ? undefined : Number(startingPrice),
  overview: Array.isArray(overview)
    ? overview.map((p) => p || "").filter((p) => p.trim())
    : [],
  facts: {
    best: facts?.best || "",
    flight: facts?.flight || "",
    currency: facts?.currency || "",
    language: facts?.language || "",
    tz: facts?.tz || "",
    budget: facts?.budget || "",
    weather: facts?.weather || "",
  },
  highlights: Array.isArray(highlights)
    ? highlights
        .filter((h) => h?.title || h?.description)
        .map((h) => ({
          icon: h?.icon || "",
          title: h?.title || "",
          description: h?.description || "",
        }))
    : [],
  beaches: Array.isArray(beaches)
    ? beaches
        .filter((b) => b?.name || b?.description)
        .map((b) => ({ name: b?.name || "", description: b?.description || "" }))
    : [],
  areas: Array.isArray(areas)
    ? areas
        .filter((a) => a?.name || a?.tag || a?.description)
        .map((a) => ({
          name: a?.name || "",
          tag: a?.tag || "",
          description: a?.description || "",
        }))
    : [],
  thingsToDo: Array.isArray(thingsToDo)
    ? thingsToDo
        .filter((t) => t?.title || t?.description)
        .map((t) => ({
          icon: t?.icon || "",
          title: t?.title || "",
          description: t?.description || "",
        }))
    : [],
  season: Array.isArray(season)
    ? season.map((s) => (["peak", "shoulder", "rainy"].includes(s) ? s : ""))
    : [],
  cost: {
    flights:
      cost?.flights === "" || cost?.flights == null ? undefined : Number(cost.flights),
    accom:
      cost?.accom === "" || cost?.accom == null ? undefined : Number(cost.accom),
    food: cost?.food === "" || cost?.food == null ? undefined : Number(cost.food),
    transport:
      cost?.transport === "" || cost?.transport == null
        ? undefined
        : Number(cost.transport),
    activities:
      cost?.activities === "" || cost?.activities == null
        ? undefined
        : Number(cost.activities),
  },
  gallery: Array.isArray(gallery)
    ? gallery
        .filter((g) => g?.url)
        .map((g) => ({
          url: g?.url || "",
          public_id: g?.public_id || "",
          alt: g?.alt || "",
        }))
    : [],
});

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      title,
      description,
      metaDescription,
      content,
      thumbnail,
      isActive,
      metaKeywords,
      routPath,
      metaTitle,
      imgageAlt,
      destinationtype,
      faqs,
      thumbnail_public_id,
      country,
      startingPrice,
      overview,
      facts,
      highlights,
      beaches,
      areas,
      thingsToDo,
      season,
      cost,
      gallery,
    } = await req.json();
    const userId = req?.user?.userId;

    if (
      !title ||
      !description ||
      !metaDescription ||
      !content ||
      !thumbnail ||
      !routPath
    ) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const existingDest = await Destination.findOne({ routPath });
      if (existingDest) {
        return error("Destination routePath already exists", {
          status: 400,
        });
      }
      const formattedFaqs = Array.isArray(faqs)
        ? faqs.filter((f) => f?.question && f?.answer) // keep only valid ones
        : [];
      const newDestination = new Destination({
        title,
        description,
        metaDescription,
        content,
        thumbnail,
        isActive,
        metaKeywords,
        routPath,
        metaTitle,
        imgageAlt,
        createdBy: userId,
        destinationtype,
        faqs: formattedFaqs,
        thumbnail_public_id,
        ...buildDetailFields({
          country,
          startingPrice,
          overview,
          facts,
          highlights,
          beaches,
          areas,
          thingsToDo,
          season,
          cost,
          gallery,
        }),
      });

      await newDestination.save();
      return success("Destination created successfully", { status: 201 });
    } catch (err) {
      console.error("Error creating Blog:", err);
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    try {
      const {
        _id,
        title,
        description,
        metaDescription,
        content,
        thumbnail,
        metaKeywords,
        metaTitle,
        imgageAlt,
        isActive,
        destinationtype,
        faqs = [],
        routPath,
        thumbnail_public_id,
        country,
        startingPrice,
        overview,
        facts,
        highlights,
        beaches,
        areas,
        thingsToDo,
        season,
        cost,
        gallery,
      } = await req.json();

      const updatedBy = req?.user?.userId;
      const role = req?.user?.role;

      if (
        !_id ||
        !title ||
        !description ||
        !metaDescription ||
        !content ||
        !metaTitle
      ) {
        return error("Missing required fields", { status: 400 });
      }

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      // ✅ Safely clone nested arrays to avoid frozen/readonly errors
      const safeFaqs = faqs.map((item) => ({
        question: item?.question || "",
        answer: item?.answer || "",
      }));

      // ✅ Build update object dynamically
      const updateData = {
        title,
        description,
        metaDescription,
        content,
        thumbnail,
        metaKeywords,
        metaTitle,
        imgageAlt,
        isActive,
        destinationtype,
        updatedBy,
        faqs: safeFaqs,
        thumbnail_public_id,
        ...buildDetailFields({
          country,
          startingPrice,
          overview,
          facts,
          highlights,
          beaches,
          areas,
          thingsToDo,
          season,
          cost,
          gallery,
        }),
      };

      // ✅ Only "admin" can change routPath
      if (role === "admin" && routPath) {
        updateData.routPath = routPath;
      }

      const updatedDestination = await Destination.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedDestination) {
        return error("Destination not found", { status: 404 });
      }

      return success("Destination updated successfully", updatedDestination);
    } catch (err) {
      console.error("Error updating Destination:", err);
      return error("Internal Server Error", { status: 500 });
    }
  })
);

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, { query }) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const query = Object.fromEntries(parsedUrl.searchParams);
      const page = parseInt(query?.page) || 1;
      const limit = parseInt(query?.limit) || 25;
      const skip = (page - 1) * limit;

      const search = query?.search?.trim();
      const filter = search
        ? { routPath: { $regex: search, $options: "i" } }
        : {};

      const Destinations = await Destination.find(filter)
        .sort({ createdAt: -1 })
        .select("title routPath thumbnail isActive")
        .skip(skip)
        .limit(limit);

      const total = await Destination.countDocuments(filter);

      return success({
        data: Destinations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("Error fetching Destinations:", err);
      return error("Internal Server Error");
    }
  })
);
