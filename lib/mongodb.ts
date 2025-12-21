import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable')
}

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectToDatabase
