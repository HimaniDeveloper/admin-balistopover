// import authMiddleware from "@/middleware/authMiddleware";
// import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
// import FlightPage from "@/models/FlightPage";
// import Popup from "@/models/Popup";
// import { error, success } from "@/utils/response";

// export const GET = dbMiddleware(
//   authMiddleware(["admin"])(async (req, res) => {
//     try {
//       const { searchParams } = new URL(req.url);
//       const searchTerm = searchParams.get("searchTerm")?.trim() || "";
//       console.log("searchTerm: ", searchTerm);

//       // 1️⃣ Build MongoDB filter
//       const filter =
//         searchTerm !== ""
//           ? {
//               $or: [
//                 { title: { $regex: searchTerm, $options: "i" } },
//                 { routPath: { $regex: searchTerm, $options: "i" } },
//               ],
//             }
//           : {};

//       // 2️⃣ Get flight pages matching filter
//       const flightPages = await FlightPage.find(
//         filter,
//         "title routPath slug airline language",
//       );

//       // 3️⃣ Get popup document
//       const popup = await Popup.findOne({ category: "flight" });

//       // 4️⃣ Map flight pages with activeRoute status
//       const pagesWithStatus = flightPages.map((flight) => {
//         const activeRoute = popup?.activeRoute?.find(
//           (r) => r.routePath === flight.routPath,
//         );
//         console.log("flight: ", flight);
//         return {
//           _id: flight._id,
//           title: flight.title,
//           slug: flight.slug,
//           routPath: flight.routPath,
//           isRouthActive: activeRoute ? activeRoute.isRouthActive : false,
//           language: flight?.language || "EN",
//         };
//       });

//       return success(pagesWithStatus);
//     } catch (err) {
//       console.error("Error fetching FlightPages:", err);
//       return error("Internal Server Error");
//     }
//   }),
// );

// export const PATCH = dbMiddleware(
//   authMiddleware(["admin"])(async (req, res) => {
//     try {
//       // const { routePath, value, language = "EN" } = await req.json();
//       const body = await req.json();

//       const routePath = body.routePath;
//       const value = body.value;
//       const language = body.language?.trim() || "EN";

//       // Ensure popup exists
//       let popup = await Popup.findOne({
//         category: "flight",

//         // "activeRoute.routePath": routePath,
//       });
//       // if (!popup) {
//       //   return error("Popup not found", 404);
//       // }
//       let RouteExist = await Popup.findOne({
//         category: "flight",
//         "activeRoute.language": language,
//         "activeRoute.routePath": routePath,
//       });
//       console.log({ popup, RouteExist });
//       // Initialize activeRoute if empty
//       if (!RouteExist || popup.activeRoute.length === 0) {
//         // popup.activeRoute = [{ routePath, isRouthActive: false }];
//         popup.activeRoute.push({ routePath, isRouthActive: value, language });

//         await popup.save();
//       }

//       // Update the route status
//       popup = await Popup.findOneAndUpdate(
//         { category: "flight", "activeRoute.routePath": routePath },
//         {
//           $set: { "activeRoute.$.isRouthActive": value, updatedAt: new Date() },
//         },
//         { new: true },
//       );

//       return success(popup);
//     } catch (err) {
//       console.error("Error updating route status:", err);
//       return error("Internal Server Error");
//     }
//   }),
// );
import authMiddleware from "@/middleware/authMiddleware";
import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import FlightPage from "@/models/FlightPage";
import Popup from "@/models/Popup";
import { error, success } from "@/utils/response";

/* ===========================
   ✅ GET API (WITH LANGUAGE FIX)
=========================== */
export const GET = dbMiddleware(
  authMiddleware(["admin"])(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url);
      const searchTerm = searchParams.get("searchTerm")?.trim() || "";

      // 🔍 Search filter
      const filter =
        searchTerm !== ""
          ? {
              $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { routPath: { $regex: searchTerm, $options: "i" } },
              ],
            }
          : {};

      // 📦 Fetch flight pages
      const flightPages = await FlightPage.find(
        filter,
        "title routPath slug airline language",
      );

      // 📦 Get popup config
      const popup = await Popup.findOne({ category: "flight" });

      // 🧠 Map with correct language match
      const pagesWithStatus = flightPages.map((flight) => {
        const lang = flight.language || "EN";

        const activeRoute = popup?.activeRoute?.find(
          (r) => r.routePath === flight.routPath && r.language === lang,
        );

        return {
          _id: flight._id,
          title: flight.title,
          slug: flight.slug,
          routPath: flight.routPath,
          isRouthActive: activeRoute ? activeRoute.isRouthActive : false,
          language: lang,
        };
      });

      return success(pagesWithStatus);
    } catch (err) {
      console.error("Error fetching FlightPages:", err);
      return error("Internal Server Error");
    }
  }),
);

/* ===========================
   ✅ PATCH API (MULTI-LANGUAGE SAFE)
=========================== */
export const PATCH = dbMiddleware(
  authMiddleware(["admin"])(async (req, res) => {
    try {
      const body = await req.json();

      const routePath = body.routePath;
      const value = body.value;
      const language = body.language?.trim() || "EN";

      if (!routePath) {
        return error("routePath is required");
      }

      // 📦 Ensure popup exists
      let popup = await Popup.findOne({ category: "flight" });

      if (!popup) {
        popup = await Popup.create({
          category: "flight",
          activeRoute: [],
        });
      }

      /* ===========================
         🔍 FIND EXISTING ENTRY
      =========================== */
      const existingIndex = popup.activeRoute.findIndex(
        (r) => r.routePath === routePath && r.language === language,
      );

      /* ===========================
         ✅ CASE HANDLING
      =========================== */

      if (existingIndex !== -1) {
        // 👉 Case 1: same route + same language → UPDATE
        popup.activeRoute[existingIndex].isRouthActive = value;
      } else {
        // 👉 Case 2/3: new route OR same route different language → INSERT
        popup.activeRoute.push({
          routePath,
          isRouthActive: value,
          language,
        });
      }

      popup.updatedAt = new Date();

      await popup.save();

      return success(popup);
    } catch (err) {
      console.error("Error updating route status:", err);
      return error("Internal Server Error");
    }
  }),
);
