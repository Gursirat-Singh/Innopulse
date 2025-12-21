import Startup from "../models/startup.js"

/* ---------------- CREATE (PENDING) ---------------- */
export const createStartup = async (req, res) => {
  try {
    const startup = await Startup.create({
      ...req.body,
      createdBy: req.user._id,
      status: "pending",
    })

    res.status(201).json(startup)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ---------------- GET APPROVED (PUBLIC) ---------------- */
export const getApprovedStartups = async (req, res) => {
  const startups = await Startup.find({ status: "approved" })
  res.json(startups)
}

/* ---------------- GET ALL STARTUPS (ADMIN) ---------------- */
export const getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find({})
      .populate("createdBy", "email")
      .populate("approvedBy", "email")
      .sort({ createdAt: -1 })
    res.json(startups)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* ---------------- GET SINGLE STARTUP (ADMIN) ---------------- */
export const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate("createdBy", "email")
      .populate("approvedBy", "email")

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" })
    }

    res.json(startup)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* ---------------- GET PENDING (ADMIN) ---------------- */
export const getPendingStartups = async (req, res) => {
  const startups = await Startup.find({ status: "pending" }).populate(
    "createdBy",
    "email"
  )
  res.json(startups)
}

/* ---------------- APPROVE STARTUP (ADMIN) ---------------- */
export const approveStartup = async (req, res) => {
  const startup = await Startup.findById(req.params.id)

  if (!startup) {
    return res.status(404).json({ message: "Startup not found" })
  }

  startup.status = "approved"
  startup.approvedBy = req.user._id
  await startup.save()

  res.json({ message: "Startup approved" })
}

/* ---------------- GET ADMIN STATS (ADMIN) ---------------- */
export const getAdminStats = async (req, res) => {
  try {
    const totalApproved = await Startup.countDocuments({ status: "approved" })
    const totalPending = await Startup.countDocuments({ status: "pending" })
    const totalRejected = await Startup.countDocuments({ status: "rejected" })

    // Get today's approved startups
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const approvedToday = await Startup.countDocuments({
      status: "approved",
      updatedAt: { $gte: today, $lt: tomorrow }
    })

    // Calculate approval rate (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const approvedLast30Days = await Startup.countDocuments({
      status: "approved",
      updatedAt: { $gte: thirtyDaysAgo }
    })

    const totalDecisionsLast30Days = await Startup.countDocuments({
      status: { $in: ["approved", "rejected"] },
      updatedAt: { $gte: thirtyDaysAgo }
    })

    const approvalRate = totalDecisionsLast30Days > 0
      ? Math.round((approvedLast30Days / totalDecisionsLast30Days) * 100)
      : 0

    res.json({
      totalApproved,
      totalPending,
      totalRejected,
      approvedToday,
      approvalRate
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* ---------------- DELETE STARTUP (ADMIN) ---------------- */
export const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" })
    }

    await Startup.findByIdAndDelete(req.params.id)
    res.json({ message: "Startup deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
