const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secret = "your-super-secret-jwt-key-change-this-in-production";

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/innopulse");
  const db = mongoose.connection.db;
  const user = await db.collection("users").findOne({ email: "user@innopulse.com" });
  if (!user) return console.log("NO");
  
  const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1h" });
  
  const resProfile = await fetch("http://localhost:5000/api/auth/profile", { headers: {"Authorization": `Bearer ${token}`}});
  const jsonProfile = await resProfile.json();
  console.log("PROFILE WATCHLIST:", jsonProfile.watchlist);

  const resWatchlist = await fetch("http://localhost:3000/api/watchlist", { headers: {"Authorization": `Bearer ${token}`}});
  const jsonWatchlist = await resWatchlist.json();
  console.log("NEXTJS WATCHLIST:", jsonWatchlist.watchlist.map(s => s._id));

  process.exit();
}
run();
