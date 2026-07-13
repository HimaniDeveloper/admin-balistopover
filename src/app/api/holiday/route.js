import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import Holiday from "@/models/Holiday";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      title,
      metaTags,
      metaDescription,
      content,
      thumbnail,
      metaKeywords,
      routPath,
      tagline,
      days,
      metaTitle,
      imgageAlt,
      price,
      offer,
    } = await req.json();
    const userId = req?.user?.userId;

    if (
      !title ||
      !metaTags ||
      !metaDescription ||
      !content ||
      !thumbnail ||
      !routPath
    ) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const existingDest = await Holiday.findOne({ routPath });
      if (existingDest) {
        return error("Holiday with this rout already exists", { status: 400 });
      }

      const newHoliday = new Holiday({
        title,
        metaTags,
        metaDescription,
        content,
        thumbnail,
        tagline,
        days,
        metaKeywords,
        routPath,
        createdBy: userId,
        metaTitle,
        imgageAlt,
        price,
        offer,
      });

      await newHoliday.save();
      return success("Holiday created successfully", { status: 201 });
    } catch (err) {
      console.error("Error creating Blog:", err);
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      _id,
      title,
      metaTags,
      metaDescription,
      content,
      thumbnail,
      tagline,
      days,
      metaKeywords,
      metaTitle,
      imgageAlt,
      price,
      offer,
    } = await req.json();

    if (
      !_id ||
      !title ||
      !metaTags ||
      !metaDescription ||
      !content ||
      !thumbnail
    ) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const updatedBy = req?.user?.userId;
      const role = req?.user?.role;

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      const updateFields = {
        title,
        metaTags,
        metaDescription,
        content,
        thumbnail,
        tagline,
        days,
        updatedBy,
        metaKeywords,
        metaTitle,
        imgageAlt,
        price,
      };

      if (role === "admin") {
        updateFields.offer = offer;
      }

      const updatedHoliday = await Holiday.findByIdAndUpdate(
        _id,
        {
          title,
          metaTags,
          metaDescription,
          content,
          thumbnail,
          tagline,
          days,
          updatedBy,
          metaKeywords,
          metaTitle,
          imgageAlt,
          price,
          offer,
        },
        { new: true }
      );

      if (!updatedHoliday) {
        return error("Holiday not found", { status: 404 });
      }

      return success("Holiday updated successfully", updatedHoliday);
    } catch (err) {
      console.error("Error updating Holiday:", err);
      return error("Internal Server Error");
    }
  })
);

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    try {
      const Holidays = await Holiday.find({});

      return success(Holidays);
    } catch (err) {
      console.error("Error fetching Holidays:", err);
      return error("Internal Server Error");
    }
  })
);
