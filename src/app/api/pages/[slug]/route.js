import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Page from "@/models/Page";
import { error, success } from "@/utils/response";

export const GET = dbMiddleware(authMiddleware()(async (req, { params }) => {
    const { slug } = params;
  
    if (!slug) {
      return error('Slug is required');
    }
  
    try {
      const page = await Page.findOne({ slug });
      if (!page) {
        return error('Page not found', { status: 404 });
      }
  
      return success(page);
    } catch (err) {
      console.error('Error fetching page:', err);
      return error('Internal Server Error');
    }
  }));