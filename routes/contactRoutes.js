import express from "express";
import Contact from "../model/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* =============================
POST : SEND MESSAGE
============================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save message in MongoDB
    const savedMessage = await Contact.create({ name, email, phone, message });
    console.log("Message saved to DB:", savedMessage);

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // App Password ke saath Gmail account
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Verify transporter before sending
    transporter.verify((error, success) => {
      if (error) {
        console.log("Transporter verification failed:", error);
      } else {
        console.log("Transporter ready to send messages");
      }
    });

    // Send email
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Contact Message",
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    res.json({ success: true });
  } catch (err) {
    console.error("Error in POST /contact:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =============================
ADMIN : GET ALL MESSAGES
============================= */
router.get("/admin", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =============================
ADMIN : DELETE MESSAGE
============================= */
router.delete("/admin/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
