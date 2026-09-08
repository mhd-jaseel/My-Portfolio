const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
    trim: true,
  },
  description: [{
    type: String,
  }],
  technologies: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
