const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const SkillCategory = require('./models/SkillCategory');
const Skill = require('./models/Skill');

async function cleanObsoleteData() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables. Please check your .env file.');
    }
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for cleanup...');

    const validSlugs = [
      'frontend',
      'backend',
      'database',
      'authentication',
      'payments',
      'devops-deployment',
      'tools'
    ];

    // Remove obsolete categories that were created under different slugs
    const deprecated = await SkillCategory.find({ slug: { $nin: validSlugs } });
    for (const d of deprecated) {
      console.log('Removing obsolete category:', d.name, `(${d.slug})`);
      await Skill.deleteMany({ category: d._id });
      await SkillCategory.deleteOne({ _id: d._id });
    }

    // Now cleanup skills under valid categories to keep only exact requested skills
    const frontendSkills = ['javascript', 'typescript', 'react-js', 'next-js', 'html5', 'css3', 'tailwind-css', 'bootstrap'];
    const backendSkills = ['node-js', 'express-js', 'rest-api', 'jwt', 'passport-js'];
    const databaseSkills = ['mongodb', 'mongoose', 'postgresql', 'prisma'];
    const authSkills = ['jwt-authentication', 'oauth-2-0', 'google-oauth', 'rbac'];
    const paymentSkills = ['razorpay', 'stripe', 'payment-gateway-integration', 'webhook-handling'];
    const devopsSkills = ['git', 'github', 'render', 'vercel', 'aws', 'cloudinary'];
    const toolSkills = ['vs-code', 'postman', 'npm', 'figma'];

    const allowedMap = {
      'frontend': frontendSkills,
      'backend': backendSkills,
      'database': databaseSkills,
      'authentication': authSkills,
      'payments': paymentSkills,
      'devops-deployment': devopsSkills,
      'tools': toolSkills,
    };

    for (const [catSlug, validSkillSlugs] of Object.entries(allowedMap)) {
      const cat = await SkillCategory.findOne({ slug: catSlug });
      if (cat) {
        const deleted = await Skill.deleteMany({ category: cat._id, slug: { $nin: validSkillSlugs } });
        if (deleted.deletedCount > 0) {
          console.log(`Cleaned ${deleted.deletedCount} old skills from category ${cat.name}`);
        }
      }
    }

    console.log('Cleanup finished successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Cleanup Error:', err);
    process.exit(1);
  }
}

cleanObsoleteData();
