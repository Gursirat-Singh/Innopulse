import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    // TTL index: Automatically expire documents 15 minutes after creation
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PendingUser || mongoose.model("PendingUser", pendingUserSchema);
