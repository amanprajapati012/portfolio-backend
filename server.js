// 🔥 dotenv MUST be on top (NO import before this)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import heroRoutes from "./routes/hero.js";
import overviewRoutes from "./routes/overview.js";
import skillRoutes from "./routes/skills.js";
import experienceRoutes from "./routes/experience.js";
import projectRoutes from "./routes/projectRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import Admin from "./model/Admin.js";

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   MIDDLEWARE
========================= */
// Increase limit for base64 / large requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS setup (allow only frontend URL or all if needed)
const allowedOrigins = [
  "http://localhost:3000",
  "https://portfolio-frontend-amber-rho.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, curl, server-side)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// 🔥 STATIC FOLDER FOR UPLOADED FILES
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);

/* =========================
   ROOT / HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   DEFAULT ADMIN SETUP
========================= */
const createOrUpdateAdmin = async () => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log("⚠️ Admin credentials missing in .env");
      return;
    }

    let admin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await Admin.create({
        email: ADMIN_EMAIL,
        password: hashedPassword,
      });
      console.log("✅ Default admin created");
    } else {
      const isMatch = await bcrypt.compare(
        ADMIN_PASSWORD,
        admin.password
      );
      if (!isMatch) {
        admin.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await admin.save();
        console.log("🔁 Admin password updated");
      } else {
        console.log("ℹ️ Admin already exists & valid");
      }
    }
  } catch (err) {
    console.error("❌ Admin setup error:", err.message);
  }
};

// 🔥 Call AFTER DB connection
createOrUpdateAdmin();

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🧠 Multer uploads ready (no ImageKit used)");
});
