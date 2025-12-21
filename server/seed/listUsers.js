import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"

dotenv.config()
  
const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")

    const users = await User.find({}, { password: 0 }) // Exclude password field
    console.log("Users in database:")
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Role: ${user.role}, Created: ${user.createdAt}`)
    })

    process.exit()
  } catch (error) {
    console.error("Error:", error.message)
    process.exit(1)
  }
}

listUsers()
