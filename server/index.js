import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import startupRoutes from "./routes/startupRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
dotenv.config()

const app = express()

app.use(helmet())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use("/api/startups", startupRoutes)
app.use("/api/auth", authRoutes)


app.get("/", (req, res) => {
  res.send("InnoPulse India API running")
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    )
  })
  .catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
