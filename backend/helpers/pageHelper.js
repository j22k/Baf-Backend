const Page = require('../models/page');
const Partner = require('../models/Partner');
const Brand = require('../models/Brand');
const Event = require('../models/Event');

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

module.exports = {
  getHomePage,
  getAllPartners,
  getAllBrands,
  getAllEvents,
};