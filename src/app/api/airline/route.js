import authMiddleware from '@/middleware/authMiddleware';
import { dbMiddleware } from '@/middleware/dbConnectMiddleware';
import Airline from '@/models/Airline';
import { success, error } from '@/utils/response';

export const GET = dbMiddleware(authMiddleware(['admin', 'user'])(async (req, res) => {
  try {
    const airlines = await Airline.find({});

    return success(airlines);
    
  } catch (err) {
    return error('Internal Server Error');
  }
}));
