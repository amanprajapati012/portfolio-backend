import express from "express";
import Hero from "../model/Hero.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// GET hero section
router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE or UPDATE hero section (protected)
router.post("/", protect, async (req, res) => {
  const { name, title, description, button1Text, button1Link, button2Text, button2Link, image } = req.body;

  try {
    let hero = await Hero.findOne();
    if (hero) {
      // update
      hero.name = name;
      hero.title = title;
      hero.description = description;
      hero.button1Text = button1Text;
      hero.button1Link = button1Link;
      hero.button2Text = button2Text;
      hero.button2Link = button2Link;
      hero.image = image;
      await hero.save();
      res.json(hero);
    } else {
      // create
      hero = await Hero.create({ name, title, description, button1Text, button1Link, button2Text, button2Link, image });
      res.json(hero);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
