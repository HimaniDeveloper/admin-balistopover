import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from '@/middleware/authMiddleware';
import { success, error } from '@/utils/response';
import Page from "@/models/Page";

export const POST = dbMiddleware(authMiddleware(['admin'])(async (req, res) => {
  const { title, slug, metaTags, metaDescription, content, createdBy, metaKeywords, metaTitle } = await req.json();

  if (!title || !slug || !createdBy) {
    return error('Missing required fields');
  }

  try {
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return error('Page with this slug already exists');
    }

    const newPage = new Page({
      title,
      slug,
      metaTags,
      metaDescription,
      content,
      metaKeywords,
      createdBy,
      metaTitle
    });

    await newPage.save();
    return success('Page created successfully', { status: 201 });
  } catch (err) {
    console.error('Error creating page:', err);
    return error('Internal Server Error');
  }
}));

export const PUT = dbMiddleware(authMiddleware(['admin'])(async (req, res) => {
  const { slug, title, metaTags, metaDescription, content, metaKeywords, metaTitle } = await req.json();

  if (!slug) {
    return error('Slug is required');
  }

  try {
    const updatedBy = req?.user?.userId;

    if (!updatedBy) {
      return error('Unauthorized', { status: 401 });
    }

    const page = await Page.findOneAndUpdate(
      { slug },
      {
        title,
        metaTags,
        metaDescription,
        content,
        metaKeywords,
        updatedBy,
        metaTitle
      },
      { new: true }
    );

    if (!page) {
      return error('Page not found', { status: 404 });
    }

    return success('Page updated successfully', page);
  } catch (err) {
    console.error('Error updating page:', err);
    return error('Internal Server Error');
  }
}));


export const GET = dbMiddleware(authMiddleware(['admin', 'user'])(async (req, res) => {

  try {
    const pages = await Page.find({}, 'title slug');

    return success(pages);
  } catch (err) {
    return error('Internal Server Error');
  }
}));