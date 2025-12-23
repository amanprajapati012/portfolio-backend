import express from "express";
import Overview from "../model/Overview.js";
import { protect } from "../middleware/protect.js"; // admin auth middleware

const router = express.Router();

// GET overview
router.get("/", async (req, res) => {
  try {
    const overview = await Overview.findOne();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE / UPDATE overview (protected)
router.post("/", protect, async (req, res) => {
  const { header, subtitle, description, cards } = req.body;

  try {
    let overview = await Overview.findOne();
    if (overview) {
      overview.header = header;
      overview.subtitle = subtitle;
      overview.description = description;
      overview.cards = cards;
      await overview.save();
      res.json(overview);
    } else {
      overview = await Overview.create({ header, subtitle, description, cards });
      res.json(overview);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
