import mongoose from 'mongoose';

const flightDestinationSchema = new mongoose.Schema(
  {
    routPath: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    startPrice: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    imgageAlt: {
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

export default mongoose.models.FlightDestination || mongoose.model('FlightDestination', flightDestinationSchema);
