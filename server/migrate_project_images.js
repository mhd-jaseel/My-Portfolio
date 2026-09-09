const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: [path.resolve(__dirname, '../.env'), path.resolve(__dirname, '.env')] });

const Project = require('./models/Project');

const defaultShowcaseImages = {
  'dynavue': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
  'vault-co': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'km-store': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
  'focus-flow': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
  'personal-portfolio': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
};

const genericFallback = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';

async function migrateProjectImages() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    const projects = await Project.find();
    console.log(`Found ${projects.length} project(s) to inspect.\n`);

    let updatedCount = 0;

    for (const project of projects) {
      const slug = (project.slug || '').toLowerCase().trim();
      const currentThumb = (project.thumbnail || '').trim();
      let modified = false;

      const isBrokenOrEphemeral =
        !currentThumb ||
        currentThumb.startsWith('/uploads/') ||
        currentThumb.startsWith('uploads/') ||
        currentThumb.startsWith('blob:') ||
        currentThumb.includes('localhost:') ||
        currentThumb.includes('127.0.0.1');

      if (isBrokenOrEphemeral) {
        const newThumb = defaultShowcaseImages[slug] || genericFallback;
        console.log(`[REPAIR] Project "${project.title}" (${project.slug})`);
        console.log(`   Old: ${currentThumb}`);
        console.log(`   New: ${newThumb}`);
        project.thumbnail = newThumb;
        modified = true;
      }

      // Clean gallery if needed
      if (Array.isArray(project.gallery) && project.gallery.length > 0) {
        const validGallery = project.gallery
          .filter(g => typeof g === 'string' && g.trim())
          .filter(g => !g.startsWith('blob:') && !g.includes('localhost:') && !g.includes('127.0.0.1'))
          .filter(g => !g.startsWith('/uploads/') && !g.startsWith('uploads/'));

        if (validGallery.length !== project.gallery.length) {
          console.log(`   [GALLERY] Removed ${project.gallery.length - validGallery.length} broken gallery item(s)`);
          project.gallery = validGallery;
          modified = true;
        }
      }

      if (modified) {
        await project.save();
        updatedCount++;
        console.log(`   -> Successfully updated in database.\n`);
      } else {
        console.log(`[OK] Project "${project.title}" already has permanent URL: ${currentThumb}`);
      }
    }

    console.log(`\nMigration completed. ${updatedCount} of ${projects.length} project(s) updated.`);
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

if (require.main === module) {
  migrateProjectImages();
}

module.exports = migrateProjectImages;
