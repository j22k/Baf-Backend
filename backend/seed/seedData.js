const Page = require('../models/page');
const Event = require('../models/Event');
const Brand = require('../models/Brand');
const Partner = require('../models/Partner');

const seedData = async () => {
  try {
    // Clear old data
    await Page.deleteMany();
    await Event.deleteMany();
    await Brand.deleteMany();
    await Partner.deleteMany();

    // Insert home page
    await Page.create({
      page_name: 'home',
      about_section: {
        description1:
          "Nestled in the heart of Baghdad, Bab Al Faouz — meaning The Gate of Omens — brings a fresh perspective to interior design...",
        description2: "Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
      },
      testimonials: [
        { name: "Ali Hassan", designation: "Client", description: "Amazing designs, exceeded expectations!", stars: 5 },
        { name: "Sara Ibrahim", designation: "Client", description: "Beautiful interiors, highly recommend.", stars: 4 }
      ],
      design_projects_completed: 180,
      client_satisfaction_rate: 96,
      years_of_experience: 15
    });

    // Insert Events
    await Event.insertMany([
      { event_name: "Interior Expo 2025", description: "Showcasing modern designs", image: "expo2025.jpg" },
      { event_name: "Design Awards", description: "Awarded for best interior design", image: "award.jpg" }
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

    console.log("✅ Sample data inserted!");
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

module.exports = seedData;