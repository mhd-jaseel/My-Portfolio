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

// Public Route Validators
const {
  validateContactMessage,
  validateQueryParams,
} = require('../middleware/validateMiddleware');

// Profile
router.get('/profile', getPublicProfile);

// Projects
router.get('/projects', validateQueryParams, getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

// Skill Categories
router.get('/skill-categories', getPublicSkillCategories);
router.get('/skill-categories/home', getPublicHomeSkillCategories);
router.get('/skill-categories/:slug', getPublicSkillCategoryBySlug);

// Skills
router.get('/skills', getPublicSkills);
router.get('/skills/home', getPublicHomeSkills);
router.get('/skills/marquee', getPublicMarqueeTools);
router.get('/marquee-tools', getPublicMarqueeTools);

// Experience
router.get('/experience', getPublicExperience);

// Contact
router.post('/contact', contactLimiter, validateContactMessage, submitContactMessage);

module.exports = router;
