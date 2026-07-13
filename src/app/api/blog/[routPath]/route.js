import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import BlogContent from "@/models/BlogContent";
import Blog from "@/models/BlogPage";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { routPath } = params;

    if (!routPath) {
      return error("Path is required");
    }

    try {
      const blog = await Blog.findOne({ routPath }).populate("content");;

      if (!blog) {
        return error("Blog not found", { status: 404 });
      }

      return success(blog);
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req, { params }) => {
    const { routPath } = params;

    if (!routPath) {
      return error("Blog path is required", { status: 400 });
    }

    try {
      const blogPage = await Blog.findOne({ routPath });
      if (!blogPage) {
        return error("Blog not found", { status: 404 });
      }

      if (blogPage.content) {
        await BlogContent.findByIdAndDelete(blogPage.content);
      }
      await Blog.findOneAndDelete({ routPath });
      return success("Blog deleted successfully");
    } catch (err) {
      return error("Internal Server Error");
    }
  })
);

export const PUT = dbMiddleware(
  authMiddleware()(async (req, { params }) => {
    const { routPath } = params;

    const { searchParams } = new URL(req.url); // req.url exists in App Router
    const isActive = searchParams.get("isActive");

    if (!routPath) {
      return error("Route is required");
    }

    try {
      const page = await Blog.findOneAndUpdate(
        { routPath },
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