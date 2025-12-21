import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    status: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible",
    },
  },
  { timestamps: true }
)

export default mongoose.model("Comment", commentSchema)
