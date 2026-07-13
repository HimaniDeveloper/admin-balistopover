import mongoose from "mongoose";

const PopupSchema = new mongoose.Schema({
  category: { type: String, required: true },
  // url: { type: String, unique: true, required: true },
  title: { type: String, required: false },
  description: { type: String, required: false },
  highLight: { type: String, required: false },
  pointer: { type: [String], default: [] },
  tfns: { type: [String], default: [] },
  isActive: { type: Boolean, default: false },
  activeRoute: {
    type: [
      {
        routePath: {
          type: String,
        },
        isRouthActive: {
          type: Boolean,
          default: false,
        },
        language: {
          type: String,
        },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Popup = mongoose.models.Popup || mongoose.model("Popup", PopupSchema);

export default Popup;
