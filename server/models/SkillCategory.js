const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema({
  name: {
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
  description: {
    type: String,
    default: '',
    trim: true,
  },
  icon: {
    type: String,
    default: 'Layers',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  showOnHome: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
