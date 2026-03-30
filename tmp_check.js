import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGO_URI = process.env.MONGO_URI;

async function check() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');
  
  const Startup = mongoose.models.Startup || mongoose.model('Startup', new mongoose.Schema({}, { strict: false }), 'startups');
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

  const idToCheck = '69caaf86880ec5d7f31322f4'; // example ID from user
  
  console.log('Looking for ID:', idToCheck);
  try {
    const startup = await Startup.findById(idToCheck);
    if (startup) {
      console.log('FOUND:', startup.name, startup._id);
    } else {
      console.log('NOT FOUND by exact ID.');
    }
  } catch(e) {
    console.log('Error searching exact ID:', e.message);
  }

  const all = await Startup.find().limit(2);
  console.log('Sample IDs in DB:', all.map(s => s._id.toString()));
  
  // also let's test if populate fails
  try {
     const st = await Startup.findById(all[0]._id).populate('createdBy').populate('approvedBy');
     console.log('Populate check success on', st._id);
  } catch(e) {
     console.log('Populate check failed:', e);
  }

  process.exit();
}

check().catch(console.error);
