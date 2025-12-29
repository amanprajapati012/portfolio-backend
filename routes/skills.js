import express from "express";
import Skill from "../model/Skill.js";
import uploadSkillImage from "../middleware/upload.js";
import ImageKit from "imagekit";

const router = express.Router();

// IMAGEKIT CONFIG
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// GET ALL SKILLS
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE SKILL
router.post("/", uploadSkillImage.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and image required" });
    }

    // UPLOAD IMAGE TO IMAGEKIT
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + "-" + req.file.originalname,
      folder: "/skills",
    });

    // SAVE IN DATABASE
    const skill = await Skill.create({
      name,
      image: result.url, // IMAGEKIT URL
    });

    res.status(201).json(skill);
  } catch (err) {
    console.error("Skill creation error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE SKILL
router.delete("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Optional: ImageKit delete (agar file ID store kiya ho)
    // await imagekit.deleteFile(skill.imageFileId);

    await skill.deleteOne();
    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
