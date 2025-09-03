const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const pageHelper = require('./helpers/pageHelper');
const { getUser, generateToken, verifyToken } = require('./helpers/userHelpers');
const cors = require('cors');


// Load env vars FIRST
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Static folder for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Your existing routes...
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

app.get('/about', async (req, res) => {
  try {
    const [Services, Team] = await Promise.all([
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
      return res.status(404).json({ message: 'Catalog data not found' });
    }

    res.json({
      Catalog: Catalog
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enhanced Login API with JWT
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Get user
    const user = await getUser(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success response
    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.Name,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected routes
app.get('/admin/dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  res.json({
    message: 'Welcome to admin dashboard',
    user: req.user
  });
});

// Token verification endpoint
app.get('/auth/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
