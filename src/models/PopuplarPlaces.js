import mongoose from 'mongoose';

const popuplarPlacesSchema = new mongoose.Schema(
  {
    routPath: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
        type: String
    },
    price: {
      type: Number
    },
    offer: {
        type: Number
    },
    thumbnail: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PopuplarPlaces || mongoose.model('PopuplarPlaces', popuplarPlacesSchema);
