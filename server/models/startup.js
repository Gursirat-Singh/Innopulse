import mongoose from "mongoose"

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sector: {
      type: String,
      required: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    stage: {
      type: String,
      enum: ["Ideation", "Seed", "Series A", "Series B", "Growth"],
      required: true,
    },

    /* ---------- Business Metrics (ADMIN ONLY) ---------- */
    funding: {
      type: Number, // in INR
      default: 0,
    },

    employees: {
      type: Number,
      default: 0,
    },

    revenueRange: {
      type: String,
    },

    /* ---------- Contact Info (USER-EDITABLE) ---------- */
    website: String,
    email: String,
    phone: String,

    /* ---------- Moderation & Ownership ---------- */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

// Prevent model overwrite in development
const Startup = mongoose.models.Startup || mongoose.model("Startup", startupSchema)

export default Startup
