import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['airline'],
      default: 'airline'
    },
    iataCode: {
      type: String,
      required: true,
      maxlength: 3,
    },
    icaoCode: {
      type: String,
      required: true,
      maxlength: 4,
    },
    businessName: {
      type: String,
      required: true,
    },
    commonName: {
      type: String,
      required: true,
    },
    rout: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Airline || mongoose.model('Airline', airlineSchema);
