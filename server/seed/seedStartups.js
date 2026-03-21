import mongoose from "mongoose"
import dotenv from "dotenv"
import Startup from "../models/startup.js"
import User from "../models/User.js"

dotenv.config({ path: "../.env.local" })

const seedStartups = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/innopulse"
    await mongoose.connect(MONGO_URI)
    console.log("MongoDB connected for seeding")

    // 1️⃣ Find an admin user
    const admin = await User.findOne({ role: "admin" })

    if (!admin) {
      throw new Error("No admin user found. Please create admin first.")
    }

    // 2️⃣ Clear existing startups
    await Startup.deleteMany({})

    // 3️⃣ Seed data (MATCHING SCHEMA)
    const startups = [
      // 1–10 FinTech
      { name: "Razorpay", sector: "FinTech", city: "Bangalore", stage: "Growth", funding: 700000000, employees: 3500, revenueRange: "₹500Cr - ₹1,000Cr", website: "https://razorpay.com", email: "contact@razorpay.com", phone: "+91-80-4040-4040", status: "approved", createdBy: admin._id },
      { name: "Zerodha", sector: "FinTech", city: "Bangalore", stage: "Growth", funding: 1250000000, employees: 1200, revenueRange: "₹1,000Cr - ₹2,000Cr", website: "https://zerodha.com", email: "support@zerodha.com", phone: "+91-80-4040-4050", status: "approved", createdBy: admin._id },
      { name: "CRED", sector: "FinTech", city: "Bangalore", stage: "Series B", funding: 800000000, employees: 1500, revenueRange: "₹100Cr - ₹200Cr", website: "https://cred.club", email: "hello@cred.club", phone: "+91-80-4040-4060", status: "approved", createdBy: admin._id },
      { name: "Groww", sector: "FinTech", city: "Bangalore", stage: "Series A", funding: 1400000000, employees: 1200, revenueRange: "₹50Cr - ₹100Cr", website: "https://groww.in", email: "support@groww.in", phone: "+91-80-4040-4070", status: "approved", createdBy: admin._id },
      { name: "PhonePe", sector: "FinTech", city: "Bangalore", stage: "Growth", funding: 2000000000, employees: 5000, revenueRange: "₹500Cr - ₹1,000Cr", website: "https://phonepe.com", email: "support@phonepe.com", phone: "+91-80-4040-4080", status: "approved", createdBy: admin._id },
      { name: "Paytm", sector: "FinTech", city: "Noida", stage: "Growth", funding: 4500000000, employees: 8000, revenueRange: "₹4,000Cr - ₹6,000Cr", website: "https://paytm.com", email: "support@paytm.com", phone: "+91-120-4040-4090", status: "approved", createdBy: admin._id },
      { name: "BharatPe", sector: "FinTech", city: "Delhi", stage: "Series B", funding: 700000000, employees: 2500, revenueRange: "₹300Cr - ₹500Cr", website: "https://bharatpe.com", email: "support@bharatpe.com", phone: "+91-11-4040-4100", status: "approved", createdBy: admin._id },
      { name: "PolicyBazaar", sector: "FinTech", city: "Gurgaon", stage: "Growth", funding: 1000000000, employees: 4000, revenueRange: "₹2,000Cr - ₹3,000Cr", website: "https://policybazaar.com", email: "support@policybazaar.com", phone: "+91-124-4040-4110", status: "approved", createdBy: admin._id },
      { name: "Upstox", sector: "FinTech", city: "Mumbai", stage: "Series B", funding: 900000000, employees: 900, revenueRange: "₹200Cr - ₹400Cr", website: "https://upstox.com", email: "support@upstox.com", phone: "+91-22-4040-4120", status: "approved", createdBy: admin._id },
      { name: "Jupiter", sector: "FinTech", city: "Bangalore", stage: "Series A", funding: 300000000, employees: 600, revenueRange: "₹50Cr - ₹100Cr", website: "https://jupiter.money", email: "support@jupiter.money", phone: "+91-80-4040-4130", status: "approved", createdBy: admin._id },

      // 11–20 E-commerce
      { name: "Flipkart", sector: "E-commerce", city: "Bangalore", stage: "Growth", funding: 12000000000, employees: 22000, revenueRange: "₹50,000Cr - ₹75,000Cr", website: "https://flipkart.com", email: "support@flipkart.com", phone: "+91-80-4040-4140", status: "approved", createdBy: admin._id },
      { name: "Meesho", sector: "E-commerce", city: "Bangalore", stage: "Series B", funding: 1200000000, employees: 4000, revenueRange: "₹200Cr - ₹300Cr", website: "https://meesho.com", email: "support@meesho.com", phone: "+91-80-4040-4150", status: "approved", createdBy: admin._id },
      { name: "Nykaa", sector: "E-commerce", city: "Mumbai", stage: "Growth", funding: 750000000, employees: 5500, revenueRange: "₹2,000Cr - ₹3,000Cr", website: "https://nykaa.com", email: "support@nykaa.com", phone: "+91-22-4040-4160", status: "approved", createdBy: admin._id },
      { name: "Myntra", sector: "E-commerce", city: "Bangalore", stage: "Growth", funding: 1600000000, employees: 6000, revenueRange: "₹5,000Cr - ₹7,000Cr", website: "https://myntra.com", email: "support@myntra.com", phone: "+91-80-4040-4170", status: "approved", createdBy: admin._id },
      { name: "Ajio", sector: "E-commerce", city: "Mumbai", stage: "Growth", funding: 800000000, employees: 3500, revenueRange: "₹3,000Cr - ₹5,000Cr", website: "https://ajio.com", email: "support@ajio.com", phone: "+91-22-4040-4180", status: "approved", createdBy: admin._id },
      { name: "Snapdeal", sector: "E-commerce", city: "Delhi", stage: "Growth", funding: 1800000000, employees: 3000, revenueRange: "₹800Cr - ₹1,200Cr", website: "https://snapdeal.com", email: "support@snapdeal.com", phone: "+91-11-4040-4190", status: "approved", createdBy: admin._id },
      { name: "Pepperfry", sector: "E-commerce", city: "Mumbai", stage: "Series B", funding: 600000000, employees: 1500, revenueRange: "₹300Cr - ₹500Cr", website: "https://pepperfry.com", email: "support@pepperfry.com", phone: "+91-22-4040-4200", status: "approved", createdBy: admin._id },
      { name: "FirstCry", sector: "E-commerce", city: "Pune", stage: "Growth", funding: 500000000, employees: 2500, revenueRange: "₹1,000Cr - ₹1,500Cr", website: "https://firstcry.com", email: "support@firstcry.com", phone: "+91-20-4040-4210", status: "approved", createdBy: admin._id },
      { name: "BigBasket", sector: "E-commerce", city: "Bangalore", stage: "Growth", funding: 1500000000, employees: 6000, revenueRange: "₹7,000Cr - ₹10,000Cr", website: "https://bigbasket.com", email: "support@bigbasket.com", phone: "+91-80-4040-4220", status: "approved", createdBy: admin._id },
      { name: "Grofers", sector: "E-commerce", city: "Gurgaon", stage: "Growth", funding: 1200000000, employees: 5000, revenueRange: "₹6,000Cr - ₹8,000Cr", website: "https://blinkit.com", email: "support@blinkit.com", phone: "+91-124-4040-4230", status: "approved", createdBy: admin._id },

      // 21–30 FoodTech
      { name: "Zomato", sector: "FoodTech", city: "Gurgaon", stage: "Growth", funding: 2200000000, employees: 5000, revenueRange: "₹3,000Cr - ₹4,000Cr", website: "https://zomato.com", email: "support@zomato.com", phone: "+91-124-4040-4240", status: "approved", createdBy: admin._id },
      { name: "Swiggy", sector: "FoodTech", city: "Bangalore", stage: "Growth", funding: 3500000000, employees: 6000, revenueRange: "₹2,500Cr - ₹3,500Cr", website: "https://swiggy.com", email: "support@swiggy.com", phone: "+91-80-4040-4250", status: "approved", createdBy: admin._id },
      { name: "EatSure", sector: "FoodTech", city: "Mumbai", stage: "Series B", funding: 300000000, employees: 2000, revenueRange: "₹400Cr - ₹600Cr", website: "https://eatsure.com", email: "support@eatsure.com", phone: "+91-22-4040-4260", status: "approved", createdBy: admin._id },
      { name: "Faasos", sector: "FoodTech", city: "Mumbai", stage: "Growth", funding: 500000000, employees: 3000, revenueRange: "₹800Cr - ₹1,200Cr", website: "https://faasos.com", email: "support@faasos.com", phone: "+91-22-4040-4270", status: "approved", createdBy: admin._id },
      { name: "Box8", sector: "FoodTech", city: "Mumbai", stage: "Series A", funding: 150000000, employees: 1200, revenueRange: "₹200Cr - ₹300Cr", website: "https://box8.in", email: "support@box8.in", phone: "+91-22-4040-4280", status: "approved", createdBy: admin._id },

      // 31–40 EdTech & SaaS
      { name: "Byju's", sector: "EdTech", city: "Bangalore", stage: "Growth", funding: 5500000000, employees: 10000, revenueRange: "₹10,000Cr - ₹15,000Cr", website: "https://byjus.com", email: "support@byjus.com", phone: "+91-80-4040-4290", status: "approved", createdBy: admin._id },
      { name: "Unacademy", sector: "EdTech", city: "Bangalore", stage: "Series B", funding: 2000000000, employees: 6000, revenueRange: "₹1,000Cr - ₹1,500Cr", website: "https://unacademy.com", email: "support@unacademy.com", phone: "+91-80-4040-4300", status: "approved", createdBy: admin._id },
      { name: "PhysicsWallah", sector: "EdTech", city: "Noida", stage: "Growth", funding: 300000000, employees: 1800, revenueRange: "₹200Cr - ₹300Cr", website: "https://physicswallah.live", email: "support@physicswallah.live", phone: "+91-120-4040-4310", status: "approved", createdBy: admin._id },
      { name: "Vedantu", sector: "EdTech", city: "Bangalore", stage: "Series B", funding: 700000000, employees: 2500, revenueRange: "₹400Cr - ₹600Cr", website: "https://vedantu.com", email: "support@vedantu.com", phone: "+91-80-4040-4320", status: "approved", createdBy: admin._id },
      { name: "Freshworks", sector: "SaaS", city: "Chennai", stage: "Growth", funding: 400000000, employees: 5500, revenueRange: "₹1,000Cr - ₹1,500Cr", website: "https://freshworks.com", email: "support@freshworks.com", phone: "+91-44-4040-4330", status: "approved", createdBy: admin._id },
      { name: "Zoho", sector: "SaaS", city: "Chennai", stage: "Growth", funding: 0, employees: 15000, revenueRange: "₹2,000Cr - ₹3,000Cr", website: "https://zoho.com", email: "support@zoho.com", phone: "+91-44-4040-4340", status: "approved", createdBy: admin._id },
      { name: "Postman", sector: "SaaS", city: "Bangalore", stage: "Series B", funding: 430000000, employees: 800, revenueRange: "₹100Cr - ₹200Cr", website: "https://postman.com", email: "support@postman.com", phone: "+91-80-4040-4350", status: "approved", createdBy: admin._id },
      { name: "Chargebee", sector: "SaaS", city: "Chennai", stage: "Growth", funding: 300000000, employees: 900, revenueRange: "₹500Cr - ₹800Cr", website: "https://chargebee.com", email: "support@chargebee.com", phone: "+91-44-4040-4360", status: "approved", createdBy: admin._id },

      // 41–50 Mobility, Health, Logistics
      { name: "Ola", sector: "Mobility", city: "Bangalore", stage: "Growth", funding: 5000000000, employees: 7000, revenueRange: "₹15,000Cr - ₹20,000Cr", website: "https://ola.app", email: "support@ola.app", phone: "+91-80-4040-4370", status: "approved", createdBy: admin._id },
      { name: "Rapido", sector: "Mobility", city: "Bangalore", stage: "Series B", funding: 400000000, employees: 2000, revenueRange: "₹500Cr - ₹800Cr", website: "https://rapido.bike", email: "support@rapido.bike", phone: "+91-80-4040-4380", status: "approved", createdBy: admin._id },
      { name: "Practo", sector: "HealthTech", city: "Bangalore", stage: "Series A", funding: 250000000, employees: 1500, revenueRange: "₹300Cr - ₹500Cr", website: "https://practo.com", email: "support@practo.com", phone: "+91-80-4040-4390", status: "approved", createdBy: admin._id },
      { name: "1mg", sector: "HealthTech", city: "Gurgaon", stage: "Series B", funding: 170000000, employees: 2000, revenueRange: "₹500Cr - ₹800Cr", website: "https://1mg.com", email: "support@1mg.com", phone: "+91-124-4040-4400", status: "approved", createdBy: admin._id },
      { name: "Delhivery", sector: "Logistics", city: "Gurgaon", stage: "Growth", funding: 1500000000, employees: 40000, revenueRange: "₹5,000Cr - ₹7,000Cr", website: "https://delhivery.com", email: "support@delhivery.com", phone: "+91-124-4040-4410", status: "approved", createdBy: admin._id }
    ]



    await Startup.insertMany(startups)

    console.log("✅ Approved startups seeded successfully")
    process.exit()
  } catch (error) {
    console.error("❌ Seeding failed:", error.message)
    process.exit(1)
  }
}

seedStartups()
