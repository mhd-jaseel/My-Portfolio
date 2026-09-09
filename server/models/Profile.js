const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Mohammed Jaseel K',
  },
  title: {
    type: String,
    required: true,
    default: 'Full Stack Developer',
  },
  tagline: {
    type: String,
    default: 'I build modern, scalable web applications using the MERN stack, TypeScript and cloud technologies.',
  },
  bio: {
    type: String,
    default: 'Passionate Full Stack Developer with a strong foundation in the MERN stack, TypeScript, and modern cloud deployment architectures. Dedicated to building reliable, scalable, and user-centric web applications with clean code and robust security.',
  },
  profileImage: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: 'India',
  },
  email: {
    type: String,
    default: 'mohammejaseel90@gmail.com',
  },
  github: {
    type: String,
    default: 'https://github.com/mhd-jaseel',
  },
  linkedin: {
    type: String,
    default: 'https://linkedin.com/in/mohammed-jaseel90',
  },
  resume: {
    type: String,
    default: '#',
  },
  availability: {
    type: String,
    default: 'Available for opportunities',
  },
  // "Meet Me in 2 Minutes" Video Section Settings
  meetMeVideo: {
    videoUrl: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
  },
  // "About Me" Section Content Settings
  aboutSection: {
    label: {
      type: String,
      default: 'About Me',
      trim: true,
    },
    heading: {
      type: String,
      default: 'EVERYTHING ABOUT\nMOHAMMED',
      trim: true,
    },
    paragraph1: {
      type: String,
      default: 'Hi, Mohammed — a passionate Full Stack Developer who loves crafting modern web applications that are both beautiful on the surface and powerful under the hood.',
      trim: true,
    },
    paragraph2: {
      type: String,
      default: 'With expertise in React, Next.js, Node.js, Express, and MongoDB, I bring together intuitive design and efficient functionality. My experience with authentication systems, payment gateways, and cloud deployment makes me confident in delivering production-ready solutions for real-world clients.',
      trim: true,
    },
    paragraph3: {
      type: String,
      default: "Whether it's a Startup MVP or a scalable enterprise application, I focus on writing clean, maintainable code and creating experiences that users love.",
      trim: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
