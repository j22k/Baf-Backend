const Page = require('../models/page');
const Event = require('../models/Event');
const Brand = require('../models/Brand');
const Partner = require('../models/Partner');
const Services = require('../models/Services');
const Team = require('../models/Team');
const Catalog = require('../models/Catalog');
const Users = require('../models/Users');
const seedImages = require('./seedImages');
const bcrypt = require('bcryptjs');
require('dotenv').config()

const seedData = async () => {
  try {


    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

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
    
    // Hash password for admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

   // Insert admin user from environment variables
    await Users.create({
      Name: adminName,
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });



    // Insert home page
    await Page.create({
      page_name: 'home',
      about_section: {
        description1:
          "Nestled in the heart of Baghdad, Bab Al Faouz — meaning The Gate of Omens — brings a fresh perspective to interior design. We create refined living spaces that blend elegance, comfort, and purpose, unlocking a world of exquisite living experiences for our clients.",
        description2: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged"
      },
      testimonials: [
        { name: "Jona Carter", designation: "Founder of EcoLux", description: "Every project Meily touches turns into a perfect blend of design and purpose. She crafted packaging that reflected our eco-friendly mission while making our products stand out on the shelves.", stars: 5 },
        { name: "Jona Carter", designation: "Founder of EcoLux", description: "Every project Meily touches turns into a perfect blend of design and purpose. She crafted packaging that reflected our eco-friendly mission while making our products stand out on the shelves.", stars: 5 },
        { name: "Jona Carter", designation: "Founder of EcoLux", description: "Every project Meily touches turns into a perfect blend of design and purpose. She crafted packaging that reflected our eco-friendly mission while making our products stand out on the shelves.", stars: 5 },
        { name: "Jona Carter", designation: "Founder of EcoLux", description: "Every project Meily touches turns into a perfect blend of design and purpose. She crafted packaging that reflected our eco-friendly mission while making our products stand out on the shelves.", stars: 5 },
        { name: "Jona Carter", designation: "Founder of EcoLux", description: "Every project Meily touches turns into a perfect blend of design and purpose. She crafted packaging that reflected our eco-friendly mission while making our products stand out on the shelves.", stars: 5 },
        { name: "Jona Carter", designation: "Founder of EcoLux", description: "Every project Meily touches turns into a perfect blend of design and purpose. She crafted packaging that reflected our eco-friendly mission while making our products stand out on the shelves.", stars: 5 },
        
      ],
      design_projects_completed: 180,
      client_satisfaction_rate: 96,
      years_of_experience: 15
    });

    // Insert Events
    await Event.insertMany([
      { event_name: "Interior Expo 2025", description: "Showcasing modern designs", image: "expo2025.jpg" },
      { event_name: "Design Awards", description: "Awarded for best interior design", image: "award.jpg" },
      { event_name: "Design Awards", description: "Awarded for best interior design", image: "award.jpg" },
      { event_name: "Design Awards", description: "Awarded for best interior design", image: "award.jpg" },
    ]);

    // Insert Brands
    await Brand.insertMany([
      { name: "IKEA", logo: "ikea.png" },
      { name: "Home Centre", logo: "homecentre.png" }
    ]);

    // Insert Partners
    await Partner.insertMany([
      { name: "Al-Futtaim", logo: "alfuttaim.png" },
      { name: "Dar Group", logo: "dargroup.png" }
    ]);


    // Insert Services
    await Services.insertMany([
      { servicename: "Residential Design", description: "Creating personalized living spaces", image: "residential.jpg" },
      { servicename: "Commercial Design", description: "Designing functional workspaces", image: "commercial.jpg" },
      { servicename: "Hospitality Design", description: "Crafting inviting hotel interiors", image: "hospitality.jpg" },
      { servicename: "Sustainable Design", description: "Eco-friendly design solutions", image: "sustainable.jpg" }
    ]);

    await Team.insertMany([
      { Name: "Alice Johnson", Designation: "Lead Designer", image: "alice.jpg" },
      { Name: "Bob Smith", Designation: "Project Manager", image: "bob.jpg" },
      { Name: "Catherine Lee", Designation: "Interior Architect", image: "catherine.jpg" },
      { Name: "David Brown", Designation: "3D Visualizer", image: "david.jpg" }
    ]);

    await Catalog.insertMany([
      { Name: "Modern Living Room", description: "A sleek and contemporary living room design.", image: "livingroom.jpg" },
      { Name: "Cozy Bedroom", description: "A warm and inviting bedroom setup.", image: "bedroom.jpg" },
      { Name: "Office Space", description: "A productive and ergonomic office design.", image: "office.jpg" },
      { Name: "Outdoor Patio", description: "A relaxing outdoor patio area.", image: "patio.jpg" }
    ]);

    await seedImages();
    console.log("✅ Sample data inserted!");
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

module.exports = seedData;