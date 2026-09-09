const mongoose = require('mongoose');

// Helper to check valid email
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

// Helper to check valid URL (http/https/relative/hash)
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '#' || trimmed.startsWith('/') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

// Middleware to validate MongoDB ObjectId in req.params
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} identifier.`,
      });
    }
    next();
  };
};

// Middleware to validate pagination/query params safely
const validateQueryParams = (req, res, next) => {
  if (req.query.limit !== undefined) {
    const limit = Number(req.query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      req.query.limit = 20; // safe default fallback
    }
  }
  if (req.query.page !== undefined) {
    const page = Number(req.query.page);
    if (isNaN(page) || page < 1 || page > 1000) {
      req.query.page = 1;
    }
  }
  next();
};

// Validation middleware for Contact Message Submission
const validateContactMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }
  if (name.trim().length > 100) {
    return res.status(400).json({ success: false, message: 'Name must not exceed 100 characters.' });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  if (subject && typeof subject === 'string' && subject.trim().length > 150) {
    return res.status(400).json({ success: false, message: 'Subject must not exceed 150 characters.' });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message content is required.' });
  }
  if (message.trim().length > 5000) {
    return res.status(400).json({ success: false, message: 'Message must not exceed 5000 characters.' });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.subject = subject ? subject.trim() : 'Portfolio Inquiry';
  req.body.message = message.trim();

  next();
};

// Validation middleware for Admin Login
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }
  req.body.email = email.trim().toLowerCase();
  next();
};

// Validation middleware for Project creation/update
const validateProjectInput = (req, res, next) => {
  const { title, slug, category, description, thumbnail, githubUrl, liveUrl, homeDisplayOrder, order } = req.body;

  if (req.method === 'POST' || title !== undefined) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Project title is required.' });
    }
    if (title.trim().length < 2 || title.trim().length > 120) {
      return res.status(400).json({ success: false, message: 'Project title must be between 2 and 120 characters.' });
    }
    req.body.title = title.trim();
  }

  if (slug !== undefined) {
    if (typeof slug !== 'string' || !slug.trim()) {
      return res.status(400).json({ success: false, message: 'Project slug is required.' });
    }
    req.body.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  if (req.method === 'POST' || category !== undefined) {
    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Project category is required.' });
    }
    req.body.category = category.trim();
  }

  if (req.method === 'POST' || description !== undefined) {
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Project summary description is required.' });
    }
    req.body.description = description.trim();
  }

  if (req.method === 'POST' || thumbnail !== undefined) {
    if (!thumbnail || typeof thumbnail !== 'string' || !thumbnail.trim()) {
      return res.status(400).json({ success: false, message: 'Project thumbnail is required.' });
    }
    const cleanThumb = thumbnail.trim();
    if (cleanThumb.startsWith('blob:')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid thumbnail: browser-local blob URLs cannot be saved. Please upload the image file.',
      });
    }
    if (cleanThumb.includes('localhost:') || cleanThumb.includes('127.0.0.1')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid thumbnail: localhost URLs cannot be saved as production assets.',
      });
    }
    if (cleanThumb.startsWith('file://') || /^[A-Za-z]:\\/.test(cleanThumb)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid thumbnail: local filesystem paths cannot be saved.',
      });
    }
    if (process.env.NODE_ENV === 'production' && (cleanThumb.startsWith('/uploads/') || cleanThumb.startsWith('uploads/'))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid thumbnail: local server /uploads paths do not persist on ephemeral container deployments. Please upload via Cloudinary.',
      });
    }
    req.body.thumbnail = cleanThumb;
  }

  if (req.body.gallery !== undefined && Array.isArray(req.body.gallery)) {
    for (const item of req.body.gallery) {
      if (typeof item !== 'string') continue;
      const cleanItem = item.trim();
      if (cleanItem.startsWith('blob:') || cleanItem.includes('localhost:') || cleanItem.includes('127.0.0.1')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid gallery image: temporary blob or localhost URLs cannot be saved.',
        });
      }
    }
  }

  if (githubUrl && typeof githubUrl === 'string' && githubUrl.trim() && !isValidUrl(githubUrl)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid GitHub URL.' });
  }

  if (liveUrl && typeof liveUrl === 'string' && liveUrl.trim() && !isValidUrl(liveUrl)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid Live Demo URL.' });
  }

  if (homeDisplayOrder !== undefined) {
    const parsed = Number(homeDisplayOrder);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      return res.status(400).json({ success: false, message: 'Home display order must be between 0 and 100.' });
    }
    req.body.homeDisplayOrder = parsed;
  }

  if (order !== undefined) {
    const parsed = Number(order);
    if (isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ success: false, message: 'Display order must be a valid non-negative number.' });
    }
    req.body.order = parsed;
  }

  next();
};

// Validation middleware for Skill Category creation/update
const validateCategoryInput = (req, res, next) => {
  const { name, displayOrder } = req.body;

  if (req.method === 'POST' || name !== undefined) {
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    if (name.trim().length < 2 || name.trim().length > 60) {
      return res.status(400).json({ success: false, message: 'Category name must be between 2 and 60 characters.' });
    }
    req.body.name = name.trim();
  }

  if (displayOrder !== undefined) {
    const parsed = Number(displayOrder);
    if (isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ success: false, message: 'Display order must be a valid non-negative number.' });
    }
    req.body.displayOrder = parsed;
  }

  next();
};

// Validation middleware for Skill creation/update
const validateSkillInput = (req, res, next) => {
  const { name, category, proficiencyPercentage, displayOrder } = req.body;

  if (req.method === 'POST' || name !== undefined) {
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }
    if (name.trim().length < 1 || name.trim().length > 60) {
      return res.status(400).json({ success: false, message: 'Skill name must be between 1 and 60 characters.' });
    }
    req.body.name = name.trim();
  }

  if (req.method === 'POST' || category !== undefined) {
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: 'A valid Skill Category is required.' });
    }
  }

  if (proficiencyPercentage !== undefined) {
    const parsed = Number(proficiencyPercentage);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      return res.status(400).json({ success: false, message: 'Proficiency must be between 0 and 100.' });
    }
    req.body.proficiencyPercentage = parsed;
  }

  if (displayOrder !== undefined) {
    const parsed = Number(displayOrder);
    if (isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ success: false, message: 'Display order must be a valid non-negative number.' });
    }
    req.body.displayOrder = parsed;
  }

  next();
};

module.exports = {
  isValidEmail,
  isValidUrl,
  validateObjectId,
  validateQueryParams,
  validateContactMessage,
  validateLoginInput,
  validateProjectInput,
  validateCategoryInput,
  validateSkillInput,
};
