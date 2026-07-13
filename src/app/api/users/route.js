import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from "@/middleware/authMiddleware";
import { success, error } from "@/utils/response";
import User from "@/models/User";

// GET all users
export const GET = dbMiddleware(
  authMiddleware(["admin"])(async (req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = url.searchParams;

      const page = parseInt(searchParams.get("page")) || 1;
      const limit = parseInt(searchParams.get("limit")) || 10;
      const search = searchParams.get("search");
      const skip = (page - 1) * limit;

      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } }
        ];
      }

      const [records, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return success({
        records,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      return error("Internal Server Error", { status: 500 });
    }
  })
);

// POST create new user
export const POST = dbMiddleware(
  authMiddleware(["admin"])(async (req) => {
    try {
      const { name, email, password, username, phone, role } = await req.json();

      if (!name || !email || !password || !username) {
        return error("Missing required fields", { status: 400 });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return error("User already exists", { status: 400 });
      }

      const newUser = new User({
        name,
        email,
        password,
        username,
        role,
        phone,
        isActive: true
      });

      await newUser.save();

      return success("User created successfully", {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          username: newUser.username,
          phone: newUser.phone,
          isActive: newUser.isActive
        }
      });
    } catch (err) {
      console.log("Error: ", err);
      return error("Internal Server Error", { status: 500 });
    }
  })
);

// PUT update user
export const PUT = dbMiddleware(
  authMiddleware(["admin"])(async (req) => {
    try {
      const { _id, name, phone, role, isActive } = await req.json();

      if (!_id) {
        return error("Missing required fields", { status: 400 });
      }

      const user = await User.findById(_id);
      if (!user) {
        return error("User not found", { status: 404 });
      }

      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.role = role || user.role;
      if ((isActive === true || isActive === false) && user.role !== 'admin') {
        user.isActive = isActive;
      }
      await user.save();

      return success("User updated successfully", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      });
    } catch (err) {
      return error("Internal Server Error", { status: 500 });
    }
  })
);

// DELETE user
export const DELETE = dbMiddleware(
  authMiddleware(["admin"])(async (req) => {
    try {
      const { id } = await req.json();

      if (!id) {
        return error("User ID is required", { status: 400 });
      }

      const user = await User.findById(id);
      if (!user) {
        return error("User not found", { status: 404 });
      }

      if (user.role === 'admin') {
        return error("Unautherized to delete admin", { status: 401 });
      }

      await User.deleteOne({ _id: id });

      return success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      return error("Internal Server Error", { status: 500 });
    }
  })
);