const mongoose = require('mongoose');
const seedData = require('../seed/seedData'); // import the seed function

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_ALTAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // After a successful connection, run the seed function if enabled by an environment variable
    if (process.env.SEED_DATA === 'true') {
      await seedData();
      console.log('Seed data processed successfully.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;