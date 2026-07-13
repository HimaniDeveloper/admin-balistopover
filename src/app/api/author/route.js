// import authMiddleware from "@/middleware/authMiddleware";
// import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
// import Author from "@/models/Author";
// import { error, success } from "@/utils/response";

// export const POST = dbMiddleware(
//   authMiddleware(["admin", "user"])(async (req, res) => {
//     const { authorName, authorDes } = await req.json();
//     const userId = req?.user?.userId;

//     if (!authorName || !authorDes) {
//       return error("Missing required fields", { status: 400 });
//     }

//     try {

//       const existingAuthor = await Author.findOne({ authorName });
//       if (existingAuthor) {
//         return error("Author already exists", { status: 400 });
//       }

//       const author = new Author({
//         authorName,
//         createdBy: userId,
//         authorDes,
//       });

//       await author.save();
//       return success("Author created successfully", { status: 201 });
//     } catch (err) {
//       console.error("Error creating Blog:", err);
//       return error("Internal Server Error");
//     }
//   })
// );

// export const GET = dbMiddleware(
//   authMiddleware(["admin", "user"])(async () => {
//     try {
//       const author = await Author.find().select("-__v -updatedAt -createdBy -createdAt");;

//       return success(author);
//     } catch (err) {
//       console.error("Error creating Blog:", err);
//     }
//   })
// );

import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import Author from "@/models/Author";
import { error, success } from "@/utils/response";

export const POST = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req, res) => {
    const {
      authorName,
      authorDes,
      slug,
      role,
      image,
      thumbnail_public_id,
      expertise,
      social,
    } = await req.json();
    console.log("thumbnail_public_id: ", thumbnail_public_id);
    const userId = req?.user?.userId;

    if (!authorName || !authorDes) {
      return error("Missing required fields", { status: 400 });
    }

    try {
      // Check by name OR slug to prevent duplicates either way
      const existingAuthor = await Author.findOne({
        $or: [{ authorName }, ...(slug ? [{ slug }] : [])],
      });

      if (existingAuthor) {
        return error("Author with this name or slug already exists", {
          status: 400,
        });
      }

      const author = new Author({
        authorName,
        authorDes,
        slug, // optional — model's pre-validate hook auto-generates if missing
        role: role || "Travel Writer",
        image: image || "",
        thumbnail_public_id,
        expertise: Array.isArray(expertise) ? expertise : [],
        social: {
          linkedin: social?.linkedin || "",
          twitter: social?.twitter || "",
          email: social?.email || "",
        },
        createdBy: userId,
      });

      await author.save();
      return success("Author created successfully", { status: 201 });
    } catch (err) {
      console.error("Error creating Author:", err);

      // Handle duplicate key from unique slug index
      if (err.code === 11000) {
        return error("An author with this slug already exists", {
          status: 409,
        });
      }
      return error("Internal Server Error");
    }
  }),
);

export const GET = dbMiddleware(
  authMiddleware(["admin", "user"])(async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const activeOnly = searchParams.get("active") === "true";

      const filter = activeOnly ? { isActive: true } : {};

      const authors = await Author.find(filter)
        .select("-__v -updatedBy")
        .sort({ createdAt: -1 });

      return success(authors);
    } catch (err) {
      console.error("Error fetching Authors:", err);
      return error("Internal Server Error");
    }
  }),
);
