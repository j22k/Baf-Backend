const fs = require('fs-extra');
const path = require('path');
const mongoose = require('mongoose');

const Brand = require('../models/Brand');
const Event = require('../models/Event');
const Partner = require('../models/Partner');

async function seedImages() {
  console.log('🖼️ Starting image seeding...');
  
  // CLEANUP STEP - Empty existing uploads
  await cleanupUploads();
  
  // Ensure directories
  await fs.ensureDir('uploads/brands');
  await fs.ensureDir('uploads/events'); 
  await fs.ensureDir('uploads/partners');
  
  // Seed images
  await seedCategory('brands', Brand, 'logo');
  await seedCategory('events', Event, 'banner');
  await seedCategory('partners', Partner, 'logo');
  
  console.log('✅ Image seeding completed!');
}

// ADD THIS NEW CLEANUP FUNCTION
async function cleanupUploads() {
  console.log('🧹 Cleaning up existing uploads...');
  
  const uploadDirs = ['uploads/brands', 'uploads/events', 'uploads/partners', 'uploads/temp'];
  
  for (const dir of uploadDirs) {
    if (await fs.pathExists(dir)) {
      await fs.emptyDir(dir);
      console.log(`🗑️  Cleaned: ${dir}`);
    }
  }
  
  console.log('✅ Cleanup completed!');
}

async function seedCategory(category, Model, field) {
  const seedDir = path.join('seed/images', category);
  
  if (!await fs.pathExists(seedDir)) {
    console.log(`No ${category} images found, skipping...`);
    return;
  }
  
  const images = await fs.readdir(seedDir);
  const documents = await Model.find({});
  
  for (let i = 0; i < Math.min(images.length, documents.length); i++) {
    const image = images[i];
    const doc = documents[i];
    
    if (isImage(image)) {
      // Generate ObjectId filename
      const objectId = new mongoose.Types.ObjectId();
      const ext = path.extname(image);
      const newFilename = `${category}_${objectId}${ext}`;
      
      // Copy image
      await fs.copy(
        path.join(seedDir, image),
        path.join('uploads', category, newFilename)
      );
      
      // Update document
      const stats = await fs.stat(path.join('uploads', category, newFilename));
      doc[field] = {
        filename: newFilename,
        path: `uploads/${category}/${newFilename}`,
        size: stats.size,
        uploadDate: new Date()
      };
      
      await doc.save();
      console.log(`✅ ${category}: ${image} -> ${newFilename}`);
    }
  }
}

function isImage(filename) {
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(
    path.extname(filename).toLowerCase()
  );
}

module.exports = seedImages;

// Allow direct run
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGO_URI)
    .then(seedImages)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
