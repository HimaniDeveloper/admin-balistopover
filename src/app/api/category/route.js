import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Category from "@/models/category";
import { error, success } from "@/utils/response";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const { name, slug, description } = await req.json();
    const userId = req?.user?.userId;

    if (!name || !slug) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");

      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return error("Category route already exists", { status: 400 });
      }

      const category = new Category({
        name,
        createdBy: userId,
        slug: sanitizedSlug,
        description,
      });

      await category.save();
      return success("Category created successfully", { status: 201 });
    } catch (err) {
      console.error("Error creating Blog:", err);
      return error("Internal Server Error");
    }
  }),
);

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async () => {
    try {
      const category = await Category.find().select(
        "-__v -updatedAt -description -createdAt",
      );

      return success(category);
    } catch (err) {
      console.error("Error creating Blog:", err);
    }
  }),
);

export const PUT = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    try {
      const { _id, name, slug, description } = await req.json();

      const updatedBy = req?.user?.userId;
      const role = req?.user?.role;

      if (!_id || !name || !slug ) {
        return error("Missing required fields", { status: 400 });
      }

      if (!updatedBy) {
        return error("Unauthorized", { status: 401 });
      }

      // ✅ Build update object dynamically
      const updateData = {
        name,
        slug,
        description,
      };

      // ✅ Only admin can change routPath
      if (role === "admin" && slug) {
        updateData.slug = slug;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return error("Category not found", { status: 404 });
      }

      return success("Category updated successfully", updatedCategory);
    } catch (err) {
      console.error("Error updating Category:", err.message);
      return error("Internal Server Error", { status: 500 });
    }
  })
);