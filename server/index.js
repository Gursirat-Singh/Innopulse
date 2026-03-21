import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import startupRoutes from "./routes/startupRoutes.js"
import authRoutes from "./routes/authRoutes.js"


dotenv.config()

const app = express()

app.use(cors())
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
  .catch((err) => console.error(err))
