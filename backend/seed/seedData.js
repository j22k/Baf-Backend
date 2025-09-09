const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Page = require("../models/page");
const Event = require("../models/Event");
const Brand = require("../models/Brand");
const Partner = require("../models/Partner");
const Services = require("../models/Services");
const Team = require("../models/Team");
const Catalog = require("../models/Catalog");
const Users = require("../models/Users");
const About = require("../models/Aboutschema");
const Testimonials = require("../models/Testimonialschema");
const bcrypt = require("bcryptjs");
require("dotenv").config();


function clearImageFolders(folders) {
  const baseDir = path.join(__dirname, "..", "images");
  folders.forEach(folder => {
    const dir = path.join(baseDir, folder);
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        fs.unlinkSync(path.join(dir, file)); // delete file
      });
      console.log(`🗑 Cleared ${dir}`);
    }
  });
}


// ✅ Updated renameAndUpdate
async function renameAndUpdate(docs, folder, field, Model) {
  const seedImagePath = path.join(__dirname, "..", "seedimage", folder, "default.jpg");

  if (!fs.existsSync(seedImagePath)) {
    console.warn(`⚠️ Missing seed image: ${seedImagePath}`);
    return;
  }

  await Promise.all(
    docs.map((doc) => {
      const newFilename = `${doc._id}.jpg`;
      const newPath = path.join(__dirname, "..", "images", folder, newFilename);

      // Ensure target folder exists
      fs.mkdirSync(path.dirname(newPath), { recursive: true });

      // Copy instead of rename (so default.jpg stays intact)
      fs.copyFileSync(seedImagePath, newPath);
      console.log(`✅ Copied ${seedImagePath} -> ${newPath}`);

      return Model.findByIdAndUpdate(doc._id, {
        [`${field}.filename`]: newFilename,
        [`${field}.path`]: `images/${folder}/${newFilename}`,
      });
    })
  );
}

const seedData = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "System Administrator";

    console.log(`Creating admin user: ${adminUsername}`);

    // Clear old data
    await Page.deleteMany();
    await Event.deleteMany();
    await Brand.deleteMany();
    await Partner.deleteMany();
    await Services.deleteMany();
    await Team.deleteMany();
    await Catalog.deleteMany();
    await Users.deleteMany();
    await About.deleteMany();
    await Testimonials.deleteMany();

    // 2️⃣ Clear old image files
    clearImageFolders([
      "brands",
      "partners",
      "services",
      "team",
      "testimonials",
      "events",
      "catalog"
    ]);
    
    console.log("🗑 Old data cleared.");

    // Hash password for admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Insert admin user
    await Users.create({
      Name: adminName,
      username: adminUsername,
      password: hashedPassword,
      role: "admin",
    });

    // Insert home page
    await Page.create({
      page_name: "home",
      design_projects_completed: 180,
      client_satisfaction_rate: 96,
      years_of_experience: 15,
    });

    // Insert About data
    await About.create({
      description1:
        "Nestled in the heart of Baghdad, Bab Al Faouz — meaning The Gate of Omens — brings a fresh perspective to interior design. We create refined living spaces that blend elegance, comfort, and purpose, unlocking a world of exquisite living experiences for our clients.",
      description2:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
    });

    // --- Testimonials ---
    const testimonials = await Testimonials.insertMany([
      { name: "John Doe", designation: "CEO, Company A", feedback: "Outstanding service and attention to detail!", stars: 5, image: {} },
      { name: "Jane Smith", designation: "CTO, Company B", feedback: "Professional and reliable team!", stars: 4, image: {} },
      { name: "Michael Johnson", designation: "Manager, Company C", feedback: "Exceeded expectations in every way.", stars: 5, image: {} },
      { name: "Emily Davis", designation: "Founder, Company D", feedback: "Great communication and results.", stars: 5, image: {} },
    ]);
    await renameAndUpdate(testimonials, "testimonials", "image", Testimonials);

    // --- Events ---
    const events = await Event.insertMany([
      { event_name: "Interior Expo 2025", description: "Showcasing modern designs", image: {} },
      { event_name: "Design Workshop", description: "Hands-on design techniques", image: {} },
      { event_name: "Sustainability in Design", description: "Eco-friendly design practices", image: {} },
      { event_name: "Furniture Fair", description: "Latest trends in furniture", image: {} },
    ]);
    await renameAndUpdate(events, "events", "image", Event);

    // --- Brands ---
    const brands = await Brand.insertMany([
      { name: "IKEA", logo: {} },
      { name: "Ashley Furniture", logo: {} },
      { name: "Steelcase", logo: {} },
    ]);
    await renameAndUpdate(brands, "brands", "logo", Brand);

    // --- Partners ---
    const partners = await Partner.insertMany([
      { name: "Home Depot", logo: {} },
      { name: "Wayfair", logo: {} },
      { name: "Lowe's", logo: {} },
      { name: "Overstock", logo: {} },
    ]);
    await renameAndUpdate(partners, "partners", "logo", Partner);

    // --- Services ---
    const services = await Services.insertMany([
      { servicename: "Residential Design", description: "Creating personalized living spaces", image: {} },
      { servicename: "Commercial Design", description: "Designing functional workspaces", image: {} },
      { servicename: "Hospitality Design", description: "Crafting inviting hotel interiors", image: {} },
      { servicename: "Sustainable Design", description: "Eco-friendly design solutions", image: {} },
    ]);
    await renameAndUpdate(services, "services", "image", Services);

    // --- Team ---
    const team = await Team.insertMany([
      { Name: "Alice Johnson", Designation: "Lead Designer", image: {} },
      { Name: "Bob Smith", Designation: "Project Manager", image: {} },
      { Name: "Catherine Lee", Designation: "Interior Architect", image: {} },
      { Name: "David Brown", Designation: "3D Visualizer", image: {} },
    ]);
    await renameAndUpdate(team, "team", "image", Team);

    // --- Catalog ---
    const catalog = await Catalog.insertMany([
      { Name: "Modern Living Room", description: "A sleek and contemporary living room design.", image: {} },
      { Name: "Cozy Bedroom", description: "A warm and inviting bedroom setup.", image: {} },
      { Name: "Office Space", description: "A productive and ergonomic office design.", image: {} },
      { Name: "Outdoor Patio", description: "A relaxing outdoor patio area.", image: {} },
      { Name: "Kitchen Design", description: "A modern and functional kitchen layout.", image: {} },
    ]);
    await renameAndUpdate(catalog, "catalog", "image", Catalog);

    console.log("🎉 Sample data inserted & images copied!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

module.exports = seedData;
