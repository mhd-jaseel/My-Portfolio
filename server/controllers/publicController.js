const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const SkillCategory = require('../models/SkillCategory');
const Experience = require('../models/Experience');
const Message = require('../models/Message');

// PUBLIC CONTROLLERS
const getPublicProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne().lean();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicProjects = async (req, res) => {
  try {
    const { homeOnly } = req.query;
    let query = { isActive: { $ne: false } };

    if (homeOnly === 'true' || homeOnly === '1') {
      query.showOnHome = true;
      const projects = await Project.find(query)
        .select('title slug category description thumbnail technologies homeDisplayOrder order')
        .sort({ homeDisplayOrder: 1, order: 1, createdAt: 1 })
        .limit(4)
        .lean();
      return res.status(200).json({ success: true, data: projects });
    }

    const projects = await Project.find(query)
      .select('title slug category description thumbnail technologies featured order')
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug.toLowerCase() }).lean();
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUBLIC SKILL CATEGORIES
const getPublicSkillCategories = async (req, res) => {
  try {
    const categories = await SkillCategory.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();
    
    // Fetch and group active skills for each category
    const categoryIds = categories.map(c => c._id);
    const skills = await Skill.find({ category: { $in: categoryIds }, isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();

    const result = categories.map(cat => ({
      ...cat,
      skills: skills.filter(s => s.category.toString() === cat._id.toString()),
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicHomeSkillCategories = async (req, res) => {
  try {
    const categories = await SkillCategory.find({ isActive: true, showOnHome: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    
    const categoryIds = categories.map(c => c._id);
    const skills = await Skill.find({ category: { $in: categoryIds }, isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    const result = categories.map(cat => ({
      ...cat,
      skills: skills.filter(s => s.category.toString() === cat._id.toString()),
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicSkillCategoryBySlug = async (req, res) => {
  try {
    const category = await SkillCategory.findOne({ 
      slug: req.params.slug.toLowerCase().trim(), 
      isActive: true 
    }).lean();

    if (!category) {
      return res.status(404).json({ success: false, message: 'Skill category not found' });
    }

    const skills = await Skill.find({ 
      category: category._id, 
      isActive: true 
    }).sort({ displayOrder: 1, createdAt: 1 }).lean();

    res.status(200).json({ 
      success: true, 
      data: {
        ...category,
        skills,
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUBLIC SKILLS
const getPublicSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true })
      .populate('category', 'name slug icon')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicHomeSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true, showOnHome: true })
      .populate('category', 'name slug icon')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicExperience = async (req, res) => {
  try {
    const experience = await Experience.find({ isActive: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

const getPublicMarqueeTools = async (req, res) => {
  try {
    const tools = await Skill.find({ isActive: true, showInMarquee: true })
      .populate('category', 'name slug icon')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ success: true, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
