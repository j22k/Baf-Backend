const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const pageHelper = require('./helpers/pageHelper');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Single route to get home page data
app.get('/', async (req, res) => {
  try {
    const [homePage, partners, brands, events] = await Promise.all([
      pageHelper.getHomePage(),
      pageHelper.getAllPartners(),
      pageHelper.getAllBrands(),
      pageHelper.getAllEvents(),
    ]);

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    res.json({
      home: homePage,
      partners,
      brands,
      events
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// get about page data
app.get('/about', async (req, res) => {
  try {
    const [Services,Team] = await Promise.all([
      pageHelper.getAllservices(),
      pageHelper.getTeam()
    ]);

    if (!Services) {
      return res.status(404).json({ message: 'Services data not found' });
    }
    if (!Team) {
      return res.status(404).json({ message: 'Team data not found' });
    }

    res.json({
      Services: Services,
      Team: Team
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/catalog', async (req, res) => {
  try {
    const [Catalog] = await Promise.all([
      pageHelper.getCatalog()
    ]);

    if (!Catalog) {
      return res.status(404).json({ message: 'Services data not found' });
    }

    res.json({
      Catalog: Catalog
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});