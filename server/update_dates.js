import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/innopulse";

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB:", MONGO_URI);
  
  const collection = mongoose.connection.collection('startups');
  const startups = await collection.find({}).toArray();
  console.log(`Found ${startups.length} startups to reseed dates for.`);
  
  const now = new Date();
  
  for (let s of startups) {
    const pastDays = Math.floor(Math.random() * 365);
    const newDate = new Date(now.getTime() - (pastDays * 24 * 60 * 60 * 1000));
    
    await collection.updateOne(
      { _id: s._id },
      { $set: { createdAt: newDate, updatedAt: newDate } }
    );
  }
  
  console.log("Successfully scattered 12-month startup creation dates.");
  process.exit(0);
}

run().catch(console.error);
