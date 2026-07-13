import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import Deal from "@/models/Deal";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      title,
      metaDescription,
      content,
      thumbnail,
      thumbnail_public_id,
      metaKeywords,
      routPath,
      metaTitle,
      imgageAlt,
      description,
      isActive,
      faqs,
    } = await req.json();
    const userId = req?.user?.userId;

    if (
      !title ||
      !metaDescription ||
      !content ||
      !routPath ||
      !description ||
      !metaTitle
    ) {
      return error("Fields are Required", { status: 400 });
    }

    try {
      const sanitizedRoutPath = routPath.replace(/[^a-zA-Z0-9-_]/g, "");

      const existingDeal = await Deal.findOne({ routPath });

      if (existingDeal) {
        return error("Deal with this route already exists", { status: 400 });
      }

      const formattedFaqs = Array.isArray(faqs)
        ? faqs.filter((f) => f?.question && f?.answer)
        : [];

      const newDealPage = new Deal({
        title,
        metaDescription,
        content,
        thumbnail,
        thumbnail_public_id,
        metaKeywords,
        routPath: sanitizedRoutPath,
        createdBy: userId,
        metaTitle,
        imgageAlt,
        description,
        isActive,
        faqs: formattedFaqs,
      });
      await newDealPage.save();
      return success("Deal created successfully", { status: 201 });
    } catch (err) {
      console.error("Error creating Deal:", err);
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      _id,
      title,
      metaDescription,
      content,
      thumbnail,
      thumbnail_public_id,
      metaKeywords,
      metaTitle,
      imgageAlt,
      description,
      routPath,
      isActive,
      faqs,
    } = await req.json();

    if (
      !_id ||
      !title ||
      !metaDescription ||
      !content ||
      !routPath ||
      !description ||
      !metaTitle
    ) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const updatedBy = req?.user?.userId;
      const role = req?.user?.role;

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      const existingDealPage = await Deal.findById(_id);
      if (!existingDealPage) {
        return error("DealPage not found", { status: 404 });
      }
      existingDealPage.title = title;
      existingDealPage.metaDescription = metaDescription;
      existingDealPage.thumbnail = thumbnail;
      existingDealPage.metaKeywords = metaKeywords;
      existingDealPage.metaTitle = metaTitle;
      existingDealPage.imgageAlt = imgageAlt;
      existingDealPage.updatedBy = updatedBy;
      existingDealPage.description = description;
      existingDealPage.thumbnail_public_id = thumbnail_public_id;
      existingDealPage.isActive = isActive;
      existingDealPage.faqs = faqs;
      existingDealPage.content = content;

      // ✅ Update routPath only if role is admin
      if (role === "admin") {
        existingDealPage.routPath = routPath;
      }

      await existingDealPage.save();

      return success("DealPage updated successfully", existingDealPage);
    } catch (err) {
      console.error("Error updating DealPage:", err);
      return error("Internal Server Error");
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

      const DealPages = await Deal.find({})
        .sort({ createdAt: -1 })
        .select("title routPath thumbnail isActive")
        .skip(skip)
        .limit(limit);

      const total = await Deal.countDocuments();

      return success({
        data: DealPages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("Error fetching BlogPages:", err);
      return error("Internal Server Error");
    }
  })
);
