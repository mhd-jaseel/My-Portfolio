const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getPublicProfile,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicSkillCategories,
  getPublicHomeSkillCategories,
  getPublicSkillCategoryBySlug,
  getPublicSkills,
  getPublicHomeSkills,
  getPublicMarqueeTools,
  getPublicExperience,
  submitContactMessage,
} = require('../controllers/publicController');

// Rate limiter for contact messages
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // max 5 submissions per IP
  message: { success: false, message: 'Too many messages sent from this IP, please try again later.' },
});

// Public Route Validators & Cache
const {
  validateContactMessage,
  validateQueryParams,
} = require('../middleware/validateMiddleware');
const { publicCache } = require('../middleware/cacheMiddleware');

// Profile (Cache 60s)
router.get('/profile', publicCache(60), getPublicProfile);

// Projects (Cache 60s)
router.get('/projects', validateQueryParams, publicCache(60), getPublicProjects);
router.get('/projects/:slug', publicCache(60), getPublicProjectBySlug);

// Skill Categories (Cache 60s)
router.get('/skill-categories', publicCache(60), getPublicSkillCategories);
router.get('/skill-categories/home', publicCache(60), getPublicHomeSkillCategories);
router.get('/skill-categories/:slug', publicCache(60), getPublicSkillCategoryBySlug);

// Skills (Cache 60s)
router.get('/skills', publicCache(60), getPublicSkills);
router.get('/skills/home', publicCache(60), getPublicHomeSkills);
router.get('/skills/marquee', publicCache(60), getPublicMarqueeTools);
router.get('/marquee-tools', publicCache(60), getPublicMarqueeTools);

// Experience (Cache 60s)
router.get('/experience', publicCache(60), getPublicExperience);

// Contact
router.post('/contact', contactLimiter, validateContactMessage, submitContactMessage);

module.exports = router;
