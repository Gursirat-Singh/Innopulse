import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable')
}

// Global cache to prevent multiple connections in serverless environments
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('Next.js connected to MongoDB!');
      return mongoose
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectToDatabase
