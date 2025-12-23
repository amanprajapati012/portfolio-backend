import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // ImageKit URL
  },
  { timestamps: true }
);

// prevent sort memory issues
skillSchema.index({ createdAt: -1 });

export default mongoose.model("Skill", skillSchema);
