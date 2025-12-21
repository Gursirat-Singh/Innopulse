import express from "express"
import {
  createStartup,
  getApprovedStartups,
  getAllStartups,
  getStartupById,
  getPendingStartups,
  approveStartup,
  getAdminStats,
  deleteStartup,
} from "../controllers/startupController.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createStartup)
router.get("/", getApprovedStartups)
router.get("/admin/all", protect, adminOnly, getAllStartups)
router.get("/:id", protect, adminOnly, getStartupById)
router.get("/pending", protect, adminOnly, getPendingStartups)
router.get("/admin/stats", protect, adminOnly, getAdminStats)
router.patch("/:id/approve", protect, adminOnly, approveStartup)
router.delete("/:id", protect, adminOnly, deleteStartup)

export default router
