const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Project = require('./models/Project');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const updates = [
      { slug: 'dynavue', liveUrl: 'https://dynavue.in' },
      { slug: 'vault-co', liveUrl: 'https://vaultco.online/' },
      { slug: 'km-store', liveUrl: 'https://kmsupermarket.online/' },
    ];

    for (const item of updates) {
      const res = await Project.updateOne(
        { slug: item.slug },
        { $set: { liveUrl: item.liveUrl } }
      );
      console.log(`Updated ${item.slug}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    const projects = await Project.find({}, 'title slug liveUrl githubUrl');
    console.log('Current projects in DB:', projects);

    process.exit(0);
  } catch (err) {
    console.error('Script Error:', err);
    process.exit(1);
  }
}

run();
