const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const SkillCategory = require('../models/SkillCategory');
const Experience = require('../models/Experience');
const Message = require('../models/Message');
const { processAndUpload, deleteMediaFile } = require('../middleware/uploadMiddleware');
const { invalidateCache } = require('../middleware/cacheMiddleware');

// PROFILE CMS
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    invalidateCache('profile');
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PROJECTS CMS
const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { 
      title, slug, category, description, detailedDescription, 
      thumbnail, gallery, technologies, features, challenges, solutions, 
      githubUrl, liveUrl, featured, order, showOnHome, homeDisplayOrder, isActive 
    } = req.body;

    const existingProject = await Project.findOne({ slug: slug.toLowerCase().trim() });
    if (existingProject) {
      return res.status(400).json({ success: false, message: 'Project with this slug already exists' });
    }

    if (showOnHome) {
      const homeProjectsCount = await Project.countDocuments({ showOnHome: true });
      if (homeProjectsCount >= 4) {
        return res.status(400).json({ 
          success: false, 
          message: 'Only 4 projects can be displayed on the Home page. Please disable one before adding another.' 
        });
      }
    }

    const newProject = await Project.create({
      title,
      slug: slug.toLowerCase().trim(),
      category,
      description,
      detailedDescription,
      thumbnail,
      gallery: gallery || [],
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()) : []),
      features: Array.isArray(features) ? features : (features ? features.split('\n').map(f => f.trim()).filter(Boolean) : []),
      challenges: Array.isArray(challenges) ? challenges : (challenges ? challenges.split('\n').map(c => c.trim()).filter(Boolean) : []),
      solutions: Array.isArray(solutions) ? solutions : (solutions ? solutions.split('\n').map(s => s.trim()).filter(Boolean) : []),
      githubUrl,
      liveUrl,
      featured: featured !== undefined ? featured : true,
      showOnHome: Boolean(showOnHome),
      homeDisplayOrder: homeDisplayOrder !== undefined ? Number(homeDisplayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: order ? Number(order) : 0,
    });

    invalidateCache('projects');
    res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const updateData = { ...req.body };

    // If enabling showOnHome, verify max 4
    if (updateData.showOnHome && !project.showOnHome) {
      const homeProjectsCount = await Project.countDocuments({ showOnHome: true, _id: { $ne: id } });
      if (homeProjectsCount >= 4) {
        return res.status(400).json({ 
          success: false, 
          message: 'Only 4 projects can be displayed on the Home page. Please disable one before selecting another.' 
        });
      }
    }

    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split('\n').map(f => f.trim()).filter(Boolean);
    }
    if (typeof updateData.challenges === 'string') {
      updateData.challenges = updateData.challenges.split('\n').map(c => c.trim()).filter(Boolean);
    }
    if (typeof updateData.solutions === 'string') {
      updateData.solutions = updateData.solutions.split('\n').map(s => s.trim()).filter(Boolean);
    }

    // Clean old thumbnail if replaced
    if (updateData.thumbnail && project.thumbnail && updateData.thumbnail !== project.thumbnail) {
      deleteMediaFile(project.thumbnail).catch((err) => console.error('Error removing old thumbnail:', err));
    }

    const updated = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    invalidateCache('projects');
    res.status(200).json({ success: true, message: 'Project updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    
    // Safely remove associated assets if stored on Cloudinary or local disk
    if (deleted.thumbnail) {
      deleteMediaFile(deleted.thumbnail).catch((err) => console.error('Error removing thumbnail on project delete:', err));
    }
    if (Array.isArray(deleted.gallery)) {
      deleted.gallery.forEach((g) => {
        if (g) deleteMediaFile(g).catch((err) => console.error('Error removing gallery asset:', err));
      });
    }

    invalidateCache('projects');
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SKILL CATEGORIES CMS
// ==========================================
const getAdminSkillCategories = async (req, res) => {
  try {
    const categories = await SkillCategory.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
    const categoryIds = categories.map(c => c._id);
    const skills = await Skill.find({ category: { $in: categoryIds } }).sort({ displayOrder: 1, createdAt: 1 }).lean();

    const data = categories.map(cat => ({
      ...cat,
      skillCount: skills.filter(s => s.category.toString() === cat._id.toString()).length,
      skills: skills.filter(s => s.category.toString() === cat._id.toString()),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSkillCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, displayOrder, isActive, showOnHome } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const generatedSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await SkillCategory.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Category with slug "${generatedSlug}" already exists` });
    }

    const newCategory = await SkillCategory.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description || '',
      icon: icon || 'Layers',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : true,
    });

    invalidateCache('skills');
    res.status(201).json({ success: true, message: 'Skill Category created successfully', data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkillCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await SkillCategory.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const updateData = { ...req.body };
    if (updateData.slug) {
      updateData.slug = updateData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const duplicate = await SkillCategory.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `Category slug "${updateData.slug}" is already in use` });
      }
    }

    const updated = await SkillCategory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    invalidateCache('skills');
    res.status(200).json({ success: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSkillCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SkillCategory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });

    // Optional: Also clean up or unassign skills linked to this category
    await Skill.deleteMany({ category: id });

    invalidateCache('skills');
    res.status(200).json({ success: true, message: 'Category and associated skills deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SKILLS CMS
// ==========================================
const getAdminSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('category', 'name slug icon')
      .sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, slug, icon, shortDescription, proficiencyPercentage, category, displayOrder, isActive, showOnHome, showInMarquee } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill name and Category are required' });
    }

    const percentage = Number(proficiencyPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return res.status(400).json({ success: false, message: 'Proficiency percentage must be a number between 0 and 100' });
    }

    const generatedSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newSkill = await Skill.create({
      name: name.trim(),
      slug: generatedSlug,
      icon: icon || 'Code',
      shortDescription: shortDescription || '',
      proficiencyPercentage: percentage,
      category,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : true,
      showInMarquee: showInMarquee !== undefined ? Boolean(showInMarquee) : false,
    });

    const populated = await Skill.findById(newSkill._id).populate('category', 'name slug icon');
    invalidateCache('skills');
    res.status(201).json({ success: true, message: 'Skill created successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const updateData = { ...req.body };
    if (updateData.proficiencyPercentage !== undefined) {
      const percentage = Number(updateData.proficiencyPercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        return res.status(400).json({ success: false, message: 'Proficiency percentage must be between 0 and 100' });
      }
      updateData.proficiencyPercentage = percentage;
    }

    if (updateData.slug) {
      updateData.slug = updateData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updated = await Skill.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('category', 'name slug icon');
    
    invalidateCache('skills');
    res.status(200).json({ success: true, message: 'Skill updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Skill not found' });
    invalidateCache('skills');
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EXPERIENCE CMS
const getAdminExperience = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.description === 'string') {
      data.description = data.description.split('\n').map(d => d.trim()).filter(Boolean);
    }
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    const newExp = await Experience.create(data);
    invalidateCache('experience');
    res.status(201).json({ success: true, message: 'Experience added successfully', data: newExp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.description === 'string') {
      data.description = data.description.split('\n').map(d => d.trim()).filter(Boolean);
    }
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    const updated = await Experience.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Experience not found' });
    invalidateCache('experience');
    res.status(200).json({ success: true, message: 'Experience updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const deleted = await Experience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Experience not found' });
    invalidateCache('experience');
    res.status(200).json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MEDIA CMS
const getAdminMediaList = async (req, res) => {
  try {
    const mediaItems = [];
    const usedUrls = new Set();
    const referenceMap = new Map(); // url -> Array of descriptions

    // Collect all database references to media files
    const [profile, projects, skills, categories] = await Promise.all([
      Profile.findOne(),
      Project.find(),
      Skill.find(),
      SkillCategory.find(),
    ]);

    const recordRef = (url, location) => {
      if (!url || typeof url !== 'string') return;
      const normalized = url.trim();
      usedUrls.add(normalized);
      if (!referenceMap.has(normalized)) {
        referenceMap.set(normalized, []);
      }
      referenceMap.get(normalized).push(location);
    };

    if (profile) {
      if (profile.profileImage) recordRef(profile.profileImage, 'Profile Photo');
      if (profile.resume && profile.resume !== '#') recordRef(profile.resume, 'Resume / CV');
      if (profile.meetMeVideo?.videoUrl) recordRef(profile.meetMeVideo.videoUrl, 'Intro Video (Home)');
      if (profile.meetMeVideo?.thumbnailUrl) recordRef(profile.meetMeVideo.thumbnailUrl, 'Video Thumbnail');
    }

    projects.forEach(p => {
      if (p.thumbnail) recordRef(p.thumbnail, `Project: ${p.title} (Thumbnail)`);
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach(img => recordRef(img, `Project: ${p.title} (Gallery)`));
      }
    });

    skills.forEach(s => {
      if (s.icon && (s.icon.startsWith('/') || s.icon.startsWith('http'))) {
        recordRef(s.icon, `Skill: ${s.name} (Icon)`);
      }
    });

    categories.forEach(c => {
      if (c.icon && (c.icon.startsWith('/') || c.icon.startsWith('http'))) {
        recordRef(c.icon, `Category: ${c.name} (Icon)`);
      }
    });

    // Scan local uploads folder
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const scanDir = (dir, relativePrefix = '/uploads') => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, `${relativePrefix}/${entry.name}`);
        } else if (entry.isFile()) {
          const fileUrl = `${relativePrefix}/${entry.name}`;
          const stat = fs.statSync(fullPath);
          const ext = path.extname(entry.name).toLowerCase();
          
          let fileType = 'image';
          if (['.mp4', '.webm', '.mov', '.ogg'].includes(ext)) fileType = 'video';
          else if (['.pdf'].includes(ext)) fileType = 'pdf';
          else if (['.svg'].includes(ext)) fileType = 'svg';

          const references = referenceMap.get(fileUrl) || [];

          mediaItems.push({
            id: Buffer.from(fileUrl).toString('base64'),
            url: fileUrl,
            filename: entry.name,
            size: stat.size,
            type: fileType,
            uploadedAt: stat.birthtime || stat.mtime,
            isUsed: references.length > 0,
            usedBy: references,
            storage: 'local',
          });
        }
      }
    };

    scanDir(uploadsDir);

    // Also include external/Cloudinary referenced media if not already on local disk
    for (const [url, refs] of referenceMap.entries()) {
      if (url.startsWith('http')) {
        let fileType = 'image';
        if (url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov)(\?.*)?$/i)) fileType = 'video';
        else if (url.endsWith('.pdf')) fileType = 'pdf';
        else if (url.endsWith('.svg')) fileType = 'svg';

        const filename = url.split('/').pop().split('?')[0] || 'remote-file';

        mediaItems.push({
          id: Buffer.from(url).toString('base64'),
          url: url,
          filename: filename,
          size: null,
          type: fileType,
          uploadedAt: null,
          isUsed: true,
          usedBy: refs,
          storage: url.includes('cloudinary.com') ? 'cloudinary' : 'external',
        });
      }
    }

    // Sort newest first if uploadedAt is present
    mediaItems.sort((a, b) => {
      if (a.uploadedAt && b.uploadedAt) return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      if (a.uploadedAt) return -1;
      return 1;
    });

    res.status(200).json({ success: true, data: mediaItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const folder = req.body.folder || 'jaseel_portfolio/projects';
    const fileUrl = await processAndUpload(req.file, folder);
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAdminMedia = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, message: 'Media URL or file path is required.' });
    }

    const cleanUrl = url.trim();

    // 1. Check whether it's referenced in DB and optionally clean the reference or return metadata
    let cleanedSections = [];

    // Profile check
    const profile = await Profile.findOne();
    if (profile) {
      let modified = false;
      if (profile.profileImage === cleanUrl) {
        profile.profileImage = '';
        cleanedSections.push('Profile Photo cleared');
        modified = true;
      }
      if (profile.resume === cleanUrl) {
        profile.resume = '#';
        cleanedSections.push('Resume link reset');
        modified = true;
      }
      if (profile.meetMeVideo?.videoUrl === cleanUrl) {
        profile.meetMeVideo.videoUrl = '';
        cleanedSections.push('Home Intro Video removed');
        modified = true;
      }
      if (profile.meetMeVideo?.thumbnailUrl === cleanUrl) {
        profile.meetMeVideo.thumbnailUrl = '';
        cleanedSections.push('Video Thumbnail removed');
        modified = true;
      }
      if (modified) await profile.save();
    }

    // Projects check
    const projects = await Project.find({
      $or: [{ thumbnail: cleanUrl }, { gallery: cleanUrl }],
    });
    for (const proj of projects) {
      let projModified = false;
      if (proj.thumbnail === cleanUrl) {
        proj.thumbnail = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
        cleanedSections.push(`Project "${proj.title}" thumbnail reset`);
        projModified = true;
      }
      if (Array.isArray(proj.gallery) && proj.gallery.includes(cleanUrl)) {
        proj.gallery = proj.gallery.filter(g => g !== cleanUrl);
        cleanedSections.push(`Project "${proj.title}" gallery item removed`);
        projModified = true;
      }
      if (projModified) await proj.save();
    }

    // Skills check
    const skills = await Skill.find({ icon: cleanUrl });
    for (const sk of skills) {
      sk.icon = 'Code';
      await sk.save();
      cleanedSections.push(`Skill "${sk.name}" icon reset to default`);
    }

    // Skill Categories check
    const categories = await SkillCategory.find({ icon: cleanUrl });
    for (const cat of categories) {
      cat.icon = 'Layers';
      await cat.save();
      cleanedSections.push(`Category "${cat.name}" icon reset to default`);
    }

    // 2. Delete the actual file from storage (Local disk or Cloudinary)
    const storageResult = await deleteMediaFile(cleanUrl);
    if (!storageResult.success) {
      console.warn('Storage deletion warning:', storageResult.message);
    }

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully.',
      cleanedReferences: cleanedSections,
    });
  } catch (error) {
    console.error('deleteAdminMedia error:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to delete media.' });
  }
};


// DASHBOARD STATS
const getAdminDashboardStats = async (req, res) => {
  try {
    const [projectCount, skillCount, categoryCount, experienceCount, messageCount] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      SkillCategory.countDocuments(),
      Experience.countDocuments(),
      Message.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        projects: projectCount,
        skills: skillCount,
        categories: categoryCount,
        experience: experienceCount,
        messages: messageCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MESSAGES CMS
const getAdminMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Diagnostic & repair endpoint for existing project media
 * Replaces broken ephemeral /uploads/ or invalid paths with permanent high-res showcase URLs
 */
const repairProjectMedia = async (req, res) => {
  try {
    const projects = await Project.find();
    let repairedCount = 0;
    const repairedProjects = [];

    const defaultProjectImages = {
      'dynavue': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
      'vault-co': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'km-store': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
      'focus-flow': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
      'personal-portfolio': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    };

    const fallbackDefault = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';

    for (const proj of projects) {
      let changed = false;
      const slugKey = (proj.slug || '').toLowerCase().trim();

      // Check thumbnail
      const thumb = (proj.thumbnail || '').trim();
      const isBrokenOrLocal = 
        !thumb || 
        thumb.startsWith('/uploads/') || 
        thumb.startsWith('uploads/') || 
        thumb.startsWith('blob:') || 
        thumb.includes('localhost:') || 
        thumb.includes('127.0.0.1');

      if (isBrokenOrLocal) {
        proj.thumbnail = defaultProjectImages[slugKey] || fallbackDefault;
        changed = true;
      }

      // Check gallery
      if (Array.isArray(proj.gallery)) {
        const cleanedGallery = proj.gallery
          .filter(g => g && typeof g === 'string' && !g.startsWith('blob:') && !g.includes('localhost:') && !g.includes('127.0.0.1'))
          .map(g => {
            if (g.startsWith('/uploads/') || g.startsWith('uploads/')) {
              return null; // clean broken ephemeral entries
            }
            return g;
          })
          .filter(Boolean);

        if (cleanedGallery.length !== proj.gallery.length) {
          proj.gallery = cleanedGallery;
          changed = true;
        }
      }

      if (changed) {
        await proj.save();
        repairedCount++;
        repairedProjects.push({ title: proj.title, slug: proj.slug, newThumbnail: proj.thumbnail });
      }
    }

    if (repairedCount > 0) {
      invalidateCache('projects');
    }

    res.status(200).json({
      success: true,
      message: `Audited ${projects.length} project(s); repaired ${repairedCount} project(s) with permanent media URLs.`,
      repairedCount,
      repairedProjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
