import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { verifyCaptcha, createCaptcha } from "../captcha.js"

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body

    const exists = await User.findOne({ email: String(email) })
    if (exists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      email: String(email),
      password: hashed,
      role: "viewer",
    })

    res.status(201).json({ message: "User registered" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body

    // Verify CAPTCHA
    if (!captchaId || !captchaAnswer) {
      return res.status(400).json({ message: "CAPTCHA verification is required" })
    }

    const isCaptchaValid = verifyCaptcha(captchaId, captchaAnswer)
    if (!isCaptchaValid) {
      return res.status(400).json({ message: "Invalid CAPTCHA. Please try again." })
    }

    const user = await User.findOne({ email: String(email) })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const match = await bcrypt.compare(String(password), user.password)
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token, refreshToken })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const generateCaptcha = async (req, res) => {
  try {
    const captcha = createCaptcha()
    res.json({
      captchaId: captcha.id,
      captchaSvg: captcha.svg
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to generate CAPTCHA" })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
