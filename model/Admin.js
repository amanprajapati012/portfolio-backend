import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // Only hash if not already hashed
  if (!this.password.startsWith("$2a$")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default mongoose.model("Admin", adminSchema);
