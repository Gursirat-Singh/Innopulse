import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// manually parse .env.local to get MONGO_URI
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');
let MONGO_URI = '';
for (const line of envLines) {
  if (line.startsWith('MONGO_URI=')) {
    MONGO_URI = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
    break;
  }
}

const idToCheck = '69caaf86880ec5d7f31322f4';

async function check() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not found in .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');
  
  const Startup = mongoose.models.Startup || mongoose.model('Startup', new mongoose.Schema({}, { strict: false }), 'startups');
  
  console.log('Checking ID:', idToCheck);
  const startup = await Startup.findById(idToCheck);
  if (startup) {
    console.log('FOUND:', JSON.stringify(startup, null, 2));
  } else {
    console.log('NOT FOUND');
    const all = await Startup.find().limit(5);
    console.log('Sample IDs in DB:', all.map(s => s._id.toString()));
  }
  
  process.exit();
}

check().catch(console.error);
