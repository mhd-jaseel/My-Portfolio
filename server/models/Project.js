const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    required: true,
  },
  gallery: [{
    type: String,
  }],
  technologies: [{
    type: String,
  }],
  features: [{
    type: String,
  }],
  challenges: [{
    type: String,
  }],
  solutions: [{
    type: String,
  }],
  githubUrl: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: true,
  },
  showOnHome: {
    type: Boolean,
    default: false,
  },
  homeDisplayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Optimize indexing for fast query resolution on MongoDB Atlas
projectSchema.index({ isActive: 1, showOnHome: 1, homeDisplayOrder: 1, order: 1 });
projectSchema.index({ isActive: 1, order: 1, createdAt: 1 });

module.exports = mongoose.model('Project', projectSchema);

