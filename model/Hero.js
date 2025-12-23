import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    button1Text: { type: String },
    button1Link: { type: String },
    button2Text: { type: String },
    button2Link: { type: String },
    image: { type: String }, // image URL
  },
  { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);
