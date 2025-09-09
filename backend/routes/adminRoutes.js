const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Import models
const About = require("../models/Aboutschema");
const Brand = require("../models/Brand");
const Partner = require("../models/Partner");
const Services = require("../models/Services");
const Team = require("../models/Team");
const Testimonials = require("../models/Testimonialschema");
const Event = require("../models/Event");
const messageHelper = require("../helpers/messageHelper");

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// Multer helper: create upload middleware per folder
function createUpload(folderName) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join(__dirname, "..", "images", folderName);
      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });
  return multer({ storage });
}

// Upload middlewares
const brandUpload = createUpload("brands");
const partnerUpload = createUpload("partners");
const servicesUpload = createUpload("services");
const teamUpload = createUpload("team");
const testimonialUpload = createUpload("testimonials");
const eventUpload = createUpload("events");

/* --------------------
   About (no image)
--------------------- */
router.post("/about", requireAdmin, async (req, res) => {
  try {
    const item = await About.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/about", async (req, res) => {
  try {
    const items = await About.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/about/:id", async (req, res) => {
  try {
    const item = await About.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "About not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/about/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "About not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/about/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await About.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "About not found" });
    res.json({ message: "About deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------
   Brands (with logo)
--------------------- */
router.post("/brands", requireAdmin, brandUpload.single("logo"), async (req, res) => {
  try {
    const brand = await Brand.create({
      name: req.body.name,
      logo: req.file
        ? {
            filename: req.file.filename,
            path: `images/brands/${req.file.filename}`,
          }
        : {},
    });
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/brands/:id", requireAdmin, brandUpload.single("logo"), async (req, res) => {
  try {
    const updateData = { name: req.body.name };
    if (req.file) {
      updateData.logo = {
        filename: req.file.filename,
        path: `images/brands/${req.file.filename}`,
      };
    }
    const updated = await Brand.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Brand not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/brands", async (req, res) => res.json(await Brand.find()));
router.get("/brands/:id", async (req, res) => res.json(await Brand.findById(req.params.id)));
router.delete("/brands/:id", requireAdmin, async (req, res) => {
  const deleted = await Brand.findByIdAndDelete(req.params.id);
  res.json(deleted ? { message: "Brand deleted" } : { message: "Not found" });
});

/* --------------------
   Partners (with logo)
--------------------- */
router.post("/partners", requireAdmin, partnerUpload.single("logo"), async (req, res) => {
  try {
    const partner = await Partner.create({
      name: req.body.name,
      logo: req.file
        ? {
            filename: req.file.filename,
            path: `images/partners/${req.file.filename}`,
          }
        : {},
    });
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/partners/:id", requireAdmin, partnerUpload.single("logo"), async (req, res) => {
  try {
    const updateData = { name: req.body.name };
    if (req.file) {
      updateData.logo = {
        filename: req.file.filename,
        path: `images/partners/${req.file.filename}`,
      };
    }
    const updated = await Partner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/partners", async (req, res) => res.json(await Partner.find()));
router.get("/partners/:id", async (req, res) => res.json(await Partner.findById(req.params.id)));
router.delete("/partners/:id", requireAdmin, async (req, res) => {
  const deleted = await Partner.findByIdAndDelete(req.params.id);
  res.json(deleted ? { message: "Partner deleted" } : { message: "Not found" });
});

/* --------------------
   Services (with image)
--------------------- */
router.post("/services", requireAdmin, servicesUpload.single("image"), async (req, res) => {
  try {
    const service = await Services.create({
      servicename: req.body.servicename,
      description: req.body.description,
      image: req.file
        ? {
            filename: req.file.filename,
            path: `images/services/${req.file.filename}`,
          }
        : {},
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/services/:id", requireAdmin, servicesUpload.single("image"), async (req, res) => {
  try {
    const updateData = {
      servicename: req.body.servicename,
      description: req.body.description,
    };
    if (req.file) {
      updateData.image = {
        filename: req.file.filename,
        path: `images/services/${req.file.filename}`,
      };
    }
    const updated = await Services.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/services", async (req, res) => res.json(await Services.find()));
router.get("/services/:id", async (req, res) => res.json(await Services.findById(req.params.id)));
router.delete("/services/:id", requireAdmin, async (req, res) => {
  const deleted = await Services.findByIdAndDelete(req.params.id);
  res.json(deleted ? { message: "Service deleted" } : { message: "Not found" });
});

/* --------------------
   Team (with image)
--------------------- */
router.post("/team", requireAdmin, teamUpload.single("image"), async (req, res) => {
  try {
    const teamMember = await Team.create({
      Name: req.body.Name,
      Designation: req.body.Designation,
      image: req.file
        ? {
            filename: req.file.filename,
            path: `images/team/${req.file.filename}`,
          }
        : {},
    });
    res.status(201).json(teamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/team/:id", requireAdmin, teamUpload.single("image"), async (req, res) => {
  try {
    const updateData = {
      Name: req.body.Name,
      Designation: req.body.Designation,
    };
    if (req.file) {
      updateData.image = {
        filename: req.file.filename,
        path: `images/team/${req.file.filename}`,
      };
    }
    const updated = await Team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/team", async (req, res) => res.json(await Team.find()));
router.get("/team/:id", async (req, res) => res.json(await Team.findById(req.params.id)));
router.delete("/team/:id", requireAdmin, async (req, res) => {
  const deleted = await Team.findByIdAndDelete(req.params.id);
  res.json(deleted ? { message: "Team member deleted" } : { message: "Not found" });
});

/* --------------------
   Testimonials (with image)
--------------------- */
router.post("/testimonials", requireAdmin, testimonialUpload.single("image"), async (req, res) => {
  try {
    const testimonial = await Testimonials.create({
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      stars: req.body.stars,
      image: req.file
        ? {
            filename: req.file.filename,
            path: `images/testimonials/${req.file.filename}`,
          }
        : {},
    });
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/testimonials/:id", requireAdmin, testimonialUpload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      stars: req.body.stars,
    };
    if (req.file) {
      updateData.image = {
        filename: req.file.filename,
        path: `images/testimonials/${req.file.filename}`,
      };
    }
    const updated = await Testimonials.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/testimonials", async (req, res) => res.json(await Testimonials.find()));
router.get("/testimonials/:id", async (req, res) => res.json(await Testimonials.findById(req.params.id)));
router.delete("/testimonials/:id", requireAdmin, async (req, res) => {
  const deleted = await Testimonials.findByIdAndDelete(req.params.id);
  res.json(deleted ? { message: "Testimonial deleted" } : { message: "Not found" });
});

/* --------------------
   Events (with image)
--------------------- */
router.post("/events", requireAdmin, eventUpload.single("image"), async (req, res) => {
  try {
    const event = await Event.create({
      event_name: req.body.event_name,
      description: req.body.description,
      image: req.file
        ? {
            filename: req.file.filename,
            path: `images/events/${req.file.filename}`,
          }
        : {},
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/events/:id", requireAdmin, eventUpload.single("image"), async (req, res) => {
  try {
    const updateData = {
      event_name: req.body.event_name,
      description: req.body.description,
    };
    if (req.file) {
      updateData.image = {
        filename: req.file.filename,
        path: `images/events/${req.file.filename}`,
      };
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/events", async (req, res) => res.json(await Event.find()));
router.get("/events/:id", async (req, res) => res.json(await Event.findById(req.params.id)));
router.delete("/events/:id", requireAdmin, async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  res.json(deleted ? { message: "Event deleted" } : { message: "Not found" });
});


/* --------------------
 Enhanced Messages (Contact Form Submissions) with Date/Time Support
--------------------- */
router.get("/messages", requireAdmin, async (req, res) => {
  try {
    const result = await messageHelper.getAllMessages(req.query);
    
    res.json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get("/messages/stats", requireAdmin, async (req, res) => {
  try {
    const stats = await messageHelper.getMessageStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get("/messages/date-range", requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required (YYYY-MM-DD format)"
      });
    }

    const messages = await messageHelper.getMessagesByDateRange(startDate, endDate);
    
    res.json({
      success: true,
      data: messages,
      dateRange: { startDate, endDate },
      count: messages.length,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get("/messages/recent", requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const recentMessages = await messageHelper.getRecentMessages(parseInt(limit));
    
    res.json({
      success: true,
      data: recentMessages,
      count: recentMessages.length,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get("/messages/:id", requireAdmin, async (req, res) => {
  try {
    const message = await messageHelper.getMessageById(req.params.id);
    
    res.json({ 
      success: true, 
      data: message,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    const statusCode = err.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.put("/messages/:id/status", requireAdmin, async (req, res) => {
  try {
    const updated = await messageHelper.updateMessageStatus(req.params.id, req.body.status);
    
    res.json({ 
      success: true, 
      message: `Message marked as ${req.body.status}`,
      data: updated,
      updatedAt: updated.updatedAt
    });
  } catch (err) {
    const statusCode = err.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.delete("/messages/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await messageHelper.deleteMessage(req.params.id);
    
    res.json({ 
      success: true, 
      message: "Message deleted successfully",
      deletedAt: new Date().toISOString(),
      deletedMessage: {
        id: deleted._id,
        name: deleted.name,
        originalCreatedAt: deleted.createdAt
      }
    });
  } catch (err) {
    const statusCode = err.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      success: false, 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
