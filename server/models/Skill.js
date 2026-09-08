const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
  },
  icon: {
    type: String,
    default: 'Code',
  },
  shortDescription: {
    type: String,
    default: '',
    trim: true,
  },
  proficiencyPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 80,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillCategory',
    required: true,
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
  showInMarquee: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Pre-save hook to generate slug if not provided
skillSchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Skill', skillSchema);
