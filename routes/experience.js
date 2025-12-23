import express from "express";
import Experience from "../model/Experience.js";

const router = express.Router();

/* =========================
   GET ALL EXPERIENCES
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await Experience.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   CREATE EXPERIENCE
========================= */
router.post("/", async (req, res) => {
  try {
    const { role, company, duration, description } = req.body;

    if (!role || !company || !duration || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const experience = await Experience.create({
      role,
      company,
      duration,
      description,
    });

    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   DELETE EXPERIENCE
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await exp.deleteOne();
    res.json({ message: "Experience deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
