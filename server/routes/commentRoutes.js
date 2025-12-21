import express from "express"
import {
  addComment,
  getStartupComments,
  updateComment,
  deleteComment,
  hideComment,
} from "../controllers/commentController.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/:startupId", protect, addComment)
router.get("/:startupId", getStartupComments)
router.patch("/:id", protect, updateComment)
router.delete("/:id", protect, deleteComment)
router.patch("/:id/hide", protect, adminOnly, hideComment)

export default router
