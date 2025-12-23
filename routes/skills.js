import express from "express";
import Skill from "../model/Skill.js";
import upload from "../middleware/upload.js";
import fs from "fs";
import path from "path";

const router = express.Router();

/* =========================
   GET ALL SKILLS
========================= */
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   CREATE SKILL
========================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !req.file) {
      return res
        .status(400)
        .json({ message: "Name and image required" });
    }

    const skill = await Skill.create({
      name,
      image: `/uploads/skills/${req.file.filename}`, // ✔️ PATH ONLY
    });

    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   DELETE SKILL
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill)
      return res.status(404).json({ message: "Skill not found" });

    // Delete image from server
    const filePath = path.join(
      process.cwd(),
      "uploads/skills",
      path.basename(skill.image)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await skill.deleteOne();
    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
