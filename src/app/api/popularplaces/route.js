import { dbMiddleware } from "@/middleware/dbConnectMiddleware";
import authMiddleware from '@/middleware/authMiddleware';
import { success, error } from '@/utils/response';
import PopuplarPlaces from "@/models/PopuplarPlaces";

export const POST = dbMiddleware(authMiddleware(['admin'])(async (req, res) => {
  const { title, routPath, description, price, offer, thumbnail } = await req.json();
  const userId = req?.user?.userId;


  if (!title || !routPath) {
    return error('Missing required fields', {status: 400});
  }

  try {

    const newPopuplarPlaces = new PopuplarPlaces({
      title,
      description, price, offer,
      thumbnail,
      routPath,
      createdBy: userId
    });

    await newPopuplarPlaces.save();
    return success('Popuplar Places created successfully', { status: 201 });
  } catch (err) {
    return error('Internal Server Error');
  }
}));


export const PUT = dbMiddleware(authMiddleware(['admin'])(async (req, res) => {
  const {_id, title, description, price, offer, thumbnail } = await req.json();
  const updatedBy = req?.user?.userId;

  try {
    if (!updatedBy) {
      return error('Unauthorized', { status: 401 });
    }

    const updatedPopuplarPlaces = await PopuplarPlaces.findByIdAndUpdate(
      _id,
      {
        description, price, offer, thumbnail, title
      },
      { new: true }
    );

    if (!updatedPopuplarPlaces) {
      return error('Popuplar Places not found', { status: 404 });
    }

    return success('Popuplar Places updated successfully', updatedPopuplarPlaces);
  } catch (err) {
    return error('Internal Server Error');
  }
}));
