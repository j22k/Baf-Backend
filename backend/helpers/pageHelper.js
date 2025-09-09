const Page = require('../models/page');
const Partner = require('../models/Partner');
const Brand = require('../models/Brand');
const Event = require('../models/Event');
const Services = require('../models/Services');
const Team = require('../models/Team');
const Catalog = require('../models/Catalog');
const about = require('../models/Aboutschema');
const Testimonials = require('../models/Testimonialschema');
const About = require('../models/Aboutschema');

const getHomePage = async () => {
  try {
    return await Page.findOne({ page_name: 'home' });
  } catch (err) {
    throw new Error('Error fetching home page: ' + err.message);
  }
};

const getAllPartners = async () => {
  try {
    return await Partner.find({});
  } catch (err) {
    throw new Error('Error fetching partners: ' + err.message);
  }
};

const getAllBrands = async () => {
  try {
    return await Brand.find({});
  } catch (err) {
    throw new Error('Error fetching brands: ' + err.message);
  }
};

const getAllEvents = async () => {
  try {
    return await Event.find({});
  } catch (err) {
    throw new Error('Error fetching events: ' + err.message);
  }
};


const getAllservices = async () => {
  try {
    return await Services.find({});
  } catch (err) {
    throw new Error('Error fetching events: ' + err.message);
  }
};

const getTeam = async () => {
  try {
    return await Team.find({});
  } catch (err) {
    throw new Error('Error fetching events: ' + err.message);
  }
};

const getCatalog = async () => {
  try {
    return await Catalog.find({});
  } catch (err) {
    throw new Error('Error fetching events: ' + err.message);
  }
};
const getAbout = async () => {
  try {
    return await About.find({});
  } catch (err) {
    throw new Error('Error fetching events: ' + err.message);
  }
};
const getTestimonials = async () => {
  try {
    return await Testimonials.find({});
  } catch (err) {
    throw new Error('Error fetching events: ' + err.message);
  }
};

module.exports = {
  getHomePage,
  getAllPartners,
  getAllBrands,
  getAllEvents,
  getAllservices,
  getTeam,
  getCatalog,
  getAbout,
  getTestimonials
};