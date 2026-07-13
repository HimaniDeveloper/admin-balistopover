import User from "@/models/User";

export const getUserDetailsById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};
