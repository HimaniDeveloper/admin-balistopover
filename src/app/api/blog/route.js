import { URL } from "url";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import Blog from "@/models/BlogPage";
import BlogContent from "@/models/BlogContent";
import Category from "@/models/category";

// ==================== CREATE (POST) ====================
export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      title,
      // metaTags,
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
      author,
      category,
      faqs,
    } = await req.json();
    const userId = req?.user?.userId;

    if (
      !title ||
      !category ||
      !metaDescription ||
      !content ||
      !routPath ||
      !author ||
      !description ||
      !metaTitle
    ) {
      return error("Fields are Required", { status: 400 });
    }

    try {
      const sanitizedRoutPath = routPath.replace(/[^a-zA-Z0-9-_]/g, "");

      const existingBlog = await Blog.findOne({ routPath });
      if (existingBlog) {
        return error("Blog with this route already exists", { status: 400 });
      }

      const categoryDoc = await Category.findById(category).select("name");
      if (!categoryDoc) {
        return error("Invalid category", { status: 400 });
      }

      const newBlogContent = new BlogContent({ content });
      await newBlogContent.save();

      const formattedFaqs = Array.isArray(faqs)
        ? faqs.filter((f) => f?.question && f?.answer)
        : [];

      const newBlogPage = new Blog({
        title,
        metaDescription,
        content: newBlogContent._id,
        thumbnail,
        thumbnail_public_id,
        metaKeywords,
        routPath: sanitizedRoutPath,
        createdBy: userId,
        metaTitle,
        imgageAlt,
        description,
        isActive,
        author,
        category,
        categoryName: categoryDoc.name,
        faqs: formattedFaqs,
      });
      await newBlogPage.save();
      return success("Blog created successfully", { status: 201 });
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
      author,
      category,
      faqs,
    } = await req.json();

    if (
      !_id ||
      !title ||
      !category ||
      !metaDescription ||
      !content ||
      !routPath ||
      !author ||
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

      const existingBlogPage = await Blog.findById(_id).populate("content");
      if (!existingBlogPage) {
        return error("BlogPage not found", { status: 404 });
      }

      if (existingBlogPage.content) {
        existingBlogPage.content.content = content;
        await existingBlogPage.content.save();
      } else {
        const newBlogContent = new BlogContent({ content });
        await newBlogContent.save();
        existingBlogPage.content = newBlogContent._id;
      }
      const categoryDoc = await Category.findById(category).select("name");
      if (!categoryDoc) {
        return error("Invalid category", { status: 400 });
      }
      existingBlogPage.title = title;

      existingBlogPage.metaDescription = metaDescription;
      existingBlogPage.thumbnail = thumbnail;
      existingBlogPage.metaKeywords = metaKeywords;
      existingBlogPage.metaTitle = metaTitle;
      existingBlogPage.imgageAlt = imgageAlt;
      existingBlogPage.updatedBy = updatedBy;
      existingBlogPage.description = description;
      existingBlogPage.thumbnail_public_id = thumbnail_public_id;
      existingBlogPage.isActive = isActive;
      existingBlogPage.author = author;
      existingBlogPage.category = category;
      existingBlogPage.categoryName = categoryDoc.name;
      existingBlogPage.faqs = faqs;
      // existingBlogPage.content = content;

      // ✅ Update routPath only if role is admin
      if (role === "admin") {
        existingBlogPage.routPath = routPath;
      }

      await existingBlogPage.save();

      return success("BlogPage updated successfully", existingBlogPage);
    } catch (err) {
      console.error("Error updating BlogPage:", err);
      return error("Internal Server Error");
    }
  })
);

// ==================== FETCH (GET) ====================
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

      const BlogPages = await Blog.find(filter)
        .sort({ createdAt: -1 })
        .select("title routPath thumbnail isActive")
        .skip(skip)
        .limit(limit);

      const total = await Blog.countDocuments(filter);

      return success({
        data: BlogPages,
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
