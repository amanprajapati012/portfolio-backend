import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: String,
  desc: String,
});

const overviewSchema = new mongoose.Schema(
  {
    header: { type: String, default: "Overview" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    cards: [cardSchema], // array of cards
  },
  { timestamps: true }
);

export default mongoose.model("Overview", overviewSchema);
