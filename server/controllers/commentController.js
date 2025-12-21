import Comment from "../models/Comment.js"
import Startup from "../models/startup.js"

/* -------- CREATE COMMENT (USER) -------- */
export const addComment = async (req, res) => {
  const { text, rating } = req.body
  const startupId = req.params.startupId

  const startup = await Startup.findById(startupId)
  if (!startup || startup.status !== "approved") {
    return res.status(400).json({ message: "Startup not available for comments" })
  }

  const comment = await Comment.create({
    startup: startupId,
    user: req.user._id,
    text,
    rating,
  })

  res.status(201).json(comment)
}

/* -------- GET COMMENTS (PUBLIC) -------- */
export const getStartupComments = async (req, res) => {
  const comments = await Comment.find({
    startup: req.params.startupId,
    status: "visible",
  })
    .populate("user", "email")
    .sort({ createdAt: -1 })

  res.json(comments)
}

/* -------- USER EDIT OWN COMMENT -------- */
export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" })
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" })
  }

  comment.text = req.body.text || comment.text
  comment.rating = req.body.rating || comment.rating
  await comment.save()

  res.json(comment)
}

/* -------- USER DELETE OWN COMMENT -------- */
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" })
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" })
  }

  await comment.deleteOne()
  res.json({ message: "Comment deleted" })
}

/* -------- ADMIN MODERATION -------- */
export const hideComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" })
  }

  comment.status = "hidden"
  await comment.save()

  res.json({ message: "Comment hidden" })
}
