const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const pageHelper = require("./helpers/pageHelper");
const { getUser, generateToken, verifyToken } = require("./helpers/userHelpers");
const messageHelper = require('./helpers/messageHelper');

const cors = require("cors");
const path = require("path");

// Load env vars FIRST
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static folder for uploads
app.use("/images", express.static(path.join(__dirname, "images")));

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* --------------------
   Public Routes
--------------------- */

// Home Page + Partners + Brands + Events
app.get("/", async (req, res) => {
  try {
    const [homePage, partners, brands, events, about, testimonials] =
      await Promise.all([
        pageHelper.getHomePage(),
        pageHelper.getAllPartners(),
        pageHelper.getAllBrands(),
        pageHelper.getAllEvents(),
        pageHelper.getAbout(),
        pageHelper.getTestimonials(),
      ]);

    if (!homePage) {
      return res.status(404).json({ message: "Home page not found" });
    }

    res.json({
      home: homePage,
      partners,
      brands,
      events,
      about,
      testimonials,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// About (Services + Team)
app.get("/about", async (req, res) => {
  try {
    const [Services, Team, about] = await Promise.all([
      pageHelper.getAllservices(),
      pageHelper.getTeam(),
      pageHelper.getAbout()
    ]);

    if (!Services) {
      return res.status(404).json({ message: "Services data not found" });
    }

    if (!Team) {
      return res.status(404).json({ message: "Team data not found" });
    }

    res.json({
      about,
      Services,
      Team,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Catalog
app.get("/catalog", async (req, res) => {
  try {
    const [Catalog] = await Promise.all([pageHelper.getCatalog()]);

    if (!Catalog) {
      return res.status(404).json({ message: "Catalog data not found" });
    }

    res.json({
      Catalog,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Enhanced contact form submission route
app.post("/contact", async (req, res) => {
  try {
    const savedMessage = await messageHelper.createMessage(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      data: {
        id: savedMessage._id,
        name: savedMessage.name,
        email: savedMessage.email,
        message: savedMessage.message,
        status: savedMessage.status,
        submittedAt: savedMessage.createdAt,
        formattedSubmittedAt: savedMessage.formattedCreatedAt,
        lastUpdated: savedMessage.updatedAt,
        formattedLastUpdated: savedMessage.formattedUpdatedAt
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle validation errors
    if (error.message.includes('required') || error.message.includes('valid email')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      timestamp: new Date().toISOString()
    });
  }
});




/* --------------------
   Auth Routes
--------------------- */

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Get user
    const user = await getUser(username, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.Name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify Token
app.get("/auth/verify", authenticateToken, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});

/* --------------------
   Admin Routes
--------------------- */

// Import and mount admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", authenticateToken, adminRoutes);

// Dashboard (example)
app.get("/admin/dashboard", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  res.json({
    message: "Welcome to admin dashboard",
    user: req.user,
  });
});

/* --------------------
   Start Server
--------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
