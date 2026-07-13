import authMiddleware from '@/middleware/authMiddleware';
import { dbMiddleware } from '@/middleware/dbConnectMiddleware';
import { User } from '@/models';
import { success, error } from '@/utils/response';

export const GET = dbMiddleware(authMiddleware()(async (req) => {
  try {
    const userId = req?.user?.userId;

    if (!userId) {
      return error('Unauthorized', { status: 401 });
    }

    const user = await User.findById(userId).select('-password -isDefaultPassword -username');

    if (!user) {
      return error('User not found', { status: 404 });
    }
    

    return success(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    return error('Internal Server Error');
  }
}));
