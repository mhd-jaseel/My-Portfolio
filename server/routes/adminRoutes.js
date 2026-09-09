const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protectAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  loginAdmin,
  logoutAdmin,
  getAdminMe,
} = require('../controllers/authController');
const {
  updateProfile,
  getAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
  repairProjectMedia,
  getAdminSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  uploadMedia,
  getAdminMediaList,
  deleteAdminMedia,
  getAdminDashboardStats,
  getAdminMessages,
  deleteMessage,
} = require('../controllers/adminController');

// Rate limiter for admin login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
});

const {
  validateObjectId,
  validateLoginInput,
  validateProjectInput,
  validateCategoryInput,
  validateSkillInput,
} = require('../middleware/validateMiddleware');

// AUTH
router.post('/login', loginLimiter, validateLoginInput, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protectAdmin, getAdminMe);

// DASHBOARD STATS
router.get('/stats', protectAdmin, getAdminDashboardStats);

// PROFILE
router.put('/profile', protectAdmin, updateProfile);

// PROJECTS
router.get('/projects', protectAdmin, getAdminProjects);
router.post('/projects/repair-media', protectAdmin, repairProjectMedia);
router.get('/projects/:id', protectAdmin, validateObjectId('id'), getAdminProjectById);
router.post('/projects', protectAdmin, validateProjectInput, createProject);
router.put('/projects/:id', protectAdmin, validateObjectId('id'), validateProjectInput, updateProject);
router.delete('/projects/:id', protectAdmin, validateObjectId('id'), deleteProject);

// SKILL CATEGORIES
router.get('/skill-categories', protectAdmin, getAdminSkillCategories);
router.post('/skill-categories', protectAdmin, validateCategoryInput, createSkillCategory);
router.put('/skill-categories/:id', protectAdmin, validateObjectId('id'), validateCategoryInput, updateSkillCategory);
router.delete('/skill-categories/:id', protectAdmin, validateObjectId('id'), deleteSkillCategory);

// SKILLS
router.get('/skills', protectAdmin, getAdminSkills);
router.post('/skills', protectAdmin, validateSkillInput, createSkill);
router.put('/skills/:id', protectAdmin, validateObjectId('id'), validateSkillInput, updateSkill);
router.delete('/skills/:id', protectAdmin, validateObjectId('id'), deleteSkill);

// EXPERIENCE
router.get('/experience', protectAdmin, getAdminExperience);
router.post('/experience', protectAdmin, createExperience);
router.put('/experience/:id', protectAdmin, validateObjectId('id'), updateExperience);
router.delete('/experience/:id', protectAdmin, validateObjectId('id'), deleteExperience);

// MEDIA
router.get('/media', protectAdmin, getAdminMediaList);
router.post('/media', protectAdmin, upload.single('file'), uploadMedia);
router.delete('/media', protectAdmin, deleteAdminMedia);

// MESSAGES
router.get('/messages', protectAdmin, getAdminMessages);
router.delete('/messages/:id', protectAdmin, validateObjectId('id'), deleteMessage);

module.exports = router;
