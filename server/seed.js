const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('./models/User');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const SkillCategory = require('./models/SkillCategory');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables. Please check your .env file.');
    }
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'mohammejaseel90@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!#';
    const adminName = process.env.ADMIN_NAME || 'Mohammed Jaseel K';

    let existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Admin account created: ${adminEmail} (password: ${adminPassword})`);
    } else {
      console.log(`Admin account already exists: ${adminEmail}`);
    }

    // 2. Seed Profile
    await Profile.deleteMany({});
    await Profile.create({
      name: 'Mohammed Jaseel K',
      title: 'Full Stack Developer',
      tagline: 'I build modern, scalable web applications using the MERN stack, TypeScript and cloud technologies.',
      bio: 'Full Stack Developer with solid experience in building production-grade MERN web applications, scalable REST APIs, secure authentication workflows (JWT, OAuth 2.0, RBAC), and robust cloud deployments. Passionate about solving complex real-world challenges through elegant, high-performance web engineering.',
      profileImage: '/developer_hero.jpg',
      location: 'India',
      email: 'mohammejaseel90@gmail.com',
      github: 'https://github.com/mhd-jaseel',
      linkedin: 'https://linkedin.com/in/mohammed-jaseel90',
      resume: 'https://github.com/mhd-jaseel',
      availability: 'Available for opportunities',
    });
    console.log('Profile seeded.');

    // 3. Seed Projects in EXACT Order: 1. DynaVue, 2. VAULT.CO, 3. KM Store
    await Project.deleteMany({});
    const projects = [
      {
        title: 'DynaVue',
        slug: 'dynavue',
        category: 'Full Stack Portfolio & Booking Platform',
        description: 'A full-stack photography portfolio and booking platform with dynamic content management, client-admin communication, booking management and real-time notifications.',
        detailedDescription: `DynaVue is a comprehensive full-stack platform designed for professional creators and client management. It merges dynamic portfolio showcase capabilities with real-time bi-directional messaging and automated scheduling. Built with high performance and modular architecture in mind, DynaVue features robust client-admin workflows, secure OAuth authentication, and instant event-driven alerts.`,
        thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1200&q=80'
        ],
        technologies: [
          'React', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 
          'Firebase', 'Cloudinary', 'Tailwind CSS', 'Framer Motion', 
          'Google OAuth 2.0', 'JWT', 'RBAC', 'Render', 'Vercel'
        ],
        features: [
          'Real-time bidirectional client-admin messaging using Socket.io',
          'User-specific Socket.io rooms for direct client-to-creator channels',
          'Firebase push notifications & real-time in-app notification badge triggers',
          'Google OAuth 2.0 & JWT authentication with HttpOnly cookies',
          'Role-based access control (RBAC) separating client, creator, and admin access',
          'Automated booking management and interactive service scheduling calendar',
          'Dynamic content management for gallery collections and service packages',
          'Multer file uploads with Cloudinary media management & WebP compression',
          'React.lazy route-based code splitting and silky Framer Motion transitions'
        ],
        challenges: [
          'Handling concurrent bi-directional chat connections and dynamic room join/leave events without message drops.',
          'Ensuring low-latency delivery of both push and in-app notifications across multi-device user sessions.'
        ],
        solutions: [
          'Implemented isolated user-scoped Socket.io room orchestration with persistent message queue backups in MongoDB.',
          'Integrated Firebase Cloud Messaging (FCM) background workers coupled with reactive React Context consumers.'
        ],
        githubUrl: 'https://github.com/mhd-jaseel',
        liveUrl: 'https://dynavue.in',
        featured: true,
        showOnHome: true,
        homeDisplayOrder: 1,
        isActive: true,
        order: 1,
      },
      {
        title: 'VAULT.CO',
        slug: 'vault-co',
        category: 'Production E-Commerce Platform',
        description: 'A production-grade enterprise e-commerce system featuring 21+ Mongoose models, Razorpay payments, automated wallet refunds, atomic inventory management, and deep admin inspection workflows.',
        detailedDescription: `VAULT.CO represents the pinnacle of modern full-stack e-commerce architecture. Engineered from the ground up for high reliability, it integrates 21+ relational and normalized Mongoose data models with high-concurrency payment orchestration via Razorpay. It features server-side cryptographic signature verification, atomic multi-item inventory reservations with rollbacks, automated wallet balance management, comprehensive coupon engines, and an advanced admin returns inspection portal.`,
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1556742049-0a67e55722c0?auto=format&fit=crop&w=1200&q=80'
        ],
        technologies: [
          'React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 
          'Mongoose', 'Razorpay', 'Sharp', 'Cloudinary', 'Vercel', 'Render'
        ],
        features: [
          'Enterprise full-stack e-commerce architecture powered by 21+ Mongoose data models',
          'Razorpay Payment Gateway with server-side HMAC-SHA256 signature verification & webhooks',
          'HTTP-only cookie authentication with role-based admin and customer boundaries',
          'Integrated digital wallet with automated instant refund pipeline for canceled orders',
          'Multi-step return and replacement lifecycle with admin inspection workflow',
          'Dynamic coupon and discount engine supporting minimum spend thresholds & user limits',
          'Product and category promotions with scheduled active dates',
          'Atomic inventory deduction and automatic rollback on transaction abandonment/failure',
          'Multer uploads with Sharp image processing pipeline converting assets to WebP for Cloudinary'
        ],
        challenges: [
          'Preventing race conditions and overselling during concurrent checkouts with simultaneous coupon claims.',
          'Handling edge cases in webhook payment verification during flaky network connections.'
        ],
        solutions: [
          'Implemented atomic MongoDB document mutations using `$inc` and conditional transaction boundaries with instant rollback handlers.',
          'Designed idempotent webhook ingestion with HMAC-SHA256 signature audits and automated transaction status reconciliation.'
        ],
        githubUrl: 'https://github.com/mhd-jaseel',
        liveUrl: 'https://vaultco.online/',
        featured: true,
        showOnHome: true,
        homeDisplayOrder: 2,
        isActive: true,
        order: 2,
      },
      {
        title: 'KM Store',
        slug: 'km-store',
        category: 'Full Stack E-Commerce Platform',
        description: 'A foundational full-stack e-commerce platform built with MVC architecture, RESTful API endpoints, unit-based inventory validation, and AWS EC2 Nginx reverse proxy deployment.',
        detailedDescription: `KM Store is a foundational full-stack e-commerce application demonstrating the core principles of MVC software architecture, server-side data validation, and bare-metal cloud infrastructure deployment. Designed with meticulous attention to clean REST API endpoints, it incorporates unit-based inventory validation, bcryptjs password encryption, JWT authentication, and high-availability AWS EC2 Nginx configuration with SSL.`,
        thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80'
        ],
        technologies: [
          'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js', 
          'MongoDB', 'AWS EC2', 'Nginx', 'SSL Certbot', 'JWT', 'bcryptjs', 'Google OAuth 2.0'
        ],
        features: [
          'End-to-end e-commerce product catalog with category hierarchies and full-text search',
          'Precise unit-based inventory tracking and multi-tier checkout workflows',
          'Robust REST API development following strict MVC architectural separation of concerns',
          'JWT authentication with role-based access control and bcryptjs password encryption',
          'Google OAuth 2.0 social sign-in alongside traditional credential authentication',
          'Production deployment on AWS EC2 with Nginx reverse proxy, gzip compression, and SSL Certbot'
        ],
        challenges: [
          'Managing server state and secure session persistence across stateless reverse proxies on AWS EC2.',
          'Maintaining zero downtime during configuration updates in Nginx.'
        ],
        solutions: [
          'Configured Nginx upstream load headers, proxy buffering, and automated SSL auto-renewals with Certbot.',
          'Structured strict Express middleware chains for authentication and sanitized REST error outputs.'
        ],
        githubUrl: 'https://github.com/mhd-jaseel',
        liveUrl: 'https://kmsupermarket.online/',
        featured: true,
        showOnHome: true,
        homeDisplayOrder: 3,
        isActive: true,
        order: 3,
      }
    ];

    await Project.insertMany(projects);
    console.log('Projects seeded in exact order (DynaVue, VAULT.CO, KM Store).');

    // 4. Seed Skill Categories & Dynamic Skills (Idempotent Upsert)
    const categoryDefinitions = [
      {
        name: 'Frontend',
        slug: 'frontend',
        description: 'Building clean, modern, responsive, and interactive user interfaces with modern React, Next.js, and CSS ecosystems.',
        icon: 'Layout',
        displayOrder: 1,
        isActive: true,
        showOnHome: true,
        skills: [
          { name: 'JavaScript', slug: 'javascript', proficiencyPercentage: 90, icon: 'Code', shortDescription: 'Core ES6+, closures, asynchronous event loop, promises, and modern DOM manipulation.', displayOrder: 1, showOnHome: true, showInMarquee: false },
          { name: 'TypeScript', slug: 'typescript', proficiencyPercentage: 80, icon: 'FileCode2', shortDescription: 'Static type checking, interfaces, generics, and type-safe React development.', displayOrder: 2, showOnHome: true, showInMarquee: false },
          { name: 'React.js', slug: 'react-js', proficiencyPercentage: 90, icon: 'Atom', shortDescription: 'Building reusable, responsive interfaces with component-based architecture and hooks.', displayOrder: 3, showOnHome: true, showInMarquee: false },
          { name: 'Next.js', slug: 'next-js', proficiencyPercentage: 82, icon: 'Zap', shortDescription: 'Full-stack React applications with server-side rendering, routing, and static generation.', displayOrder: 4, showOnHome: true, showInMarquee: false },
          { name: 'HTML5', slug: 'html5', proficiencyPercentage: 95, icon: 'FileText', shortDescription: 'Semantic markup, accessibility compliance (WCAG/ARIA), and structured web standards.', displayOrder: 5, showOnHome: false, showInMarquee: false },
          { name: 'CSS3', slug: 'css3', proficiencyPercentage: 90, icon: 'Palette', shortDescription: 'Modern CSS layouts, Flexbox, Grid, keyframe animations, and custom styling.', displayOrder: 6, showOnHome: false, showInMarquee: false },
          { name: 'Tailwind CSS', slug: 'tailwind-css', proficiencyPercentage: 88, icon: 'Wind', shortDescription: 'Rapid utility-first styling, design system tokens, responsive variants, and dark mode.', displayOrder: 7, showOnHome: true, showInMarquee: false },
          { name: 'Bootstrap', slug: 'bootstrap', proficiencyPercentage: 85, icon: 'Layers', shortDescription: 'Responsive grid frameworks, utility classes, and rapid component development.', displayOrder: 8, showOnHome: false, showInMarquee: false },
        ]
      },
      {
        name: 'Backend',
        slug: 'backend',
        description: 'Developing scalable server-side architectures, RESTful APIs, and robust application services.',
        icon: 'Server',
        displayOrder: 2,
        isActive: true,
        showOnHome: true,
        skills: [
          { name: 'Node.js', slug: 'node-js', proficiencyPercentage: 88, icon: 'Server', shortDescription: 'Developing scalable server-side applications, async pipelines, and event-driven backends.', displayOrder: 1, showOnHome: true, showInMarquee: false },
          { name: 'Express.js', slug: 'express-js', proficiencyPercentage: 88, icon: 'Cpu', shortDescription: 'Fast, minimalist web framework for routing, middleware architectures, and microservices.', displayOrder: 2, showOnHome: true, showInMarquee: false },
          { name: 'REST API', slug: 'rest-api', proficiencyPercentage: 90, icon: 'Globe', shortDescription: 'Architecting clean, scalable RESTful API endpoints with structured error handling.', displayOrder: 3, showOnHome: true, showInMarquee: false },
          { name: 'JWT', slug: 'jwt', proficiencyPercentage: 85, icon: 'Key', shortDescription: 'Stateless session authentication with signed tokens and secure verification middleware.', displayOrder: 4, showOnHome: true, showInMarquee: false },
          { name: 'Passport.js', slug: 'passport-js', proficiencyPercentage: 78, icon: 'ShieldCheck', shortDescription: 'Flexible authentication middleware for Node.js supporting multiple login strategies.', displayOrder: 5, showOnHome: false, showInMarquee: false },
        ]
      },
      {
        name: 'Database',
        slug: 'database',
        description: 'Managing flexible NoSQL and structured SQL database engines with transactional data integrity.',
        icon: 'Database',
        displayOrder: 3,
        isActive: true,
        showOnHome: true,
        skills: [
          { name: 'MongoDB', slug: 'mongodb', proficiencyPercentage: 88, icon: 'Database', shortDescription: 'Working with flexible document-based data models, indexing, and high-performance queries.', displayOrder: 1, showOnHome: true, showInMarquee: false },
          { name: 'Mongoose', slug: 'mongoose', proficiencyPercentage: 85, icon: 'FileSpreadsheet', shortDescription: 'Elegant MongoDB object modeling, schema validation, middleware hooks, and aggregations.', displayOrder: 2, showOnHome: true, showInMarquee: false },
          { name: 'PostgreSQL', slug: 'postgresql', proficiencyPercentage: 72, icon: 'Layers', shortDescription: 'Relational data modeling, ACID transactions, complex joins, and SQL query optimization.', displayOrder: 3, showOnHome: true, showInMarquee: false },
          { name: 'Prisma', slug: 'prisma', proficiencyPercentage: 70, icon: 'Cpu', shortDescription: 'Type-safe database ORM and query builder with automated schema migrations.', displayOrder: 4, showOnHome: false, showInMarquee: false },
        ]
      },
      {
        name: 'Authentication',
        slug: 'authentication',
        description: 'Implementing secure user authentication workflows, token validation, and granular authorization levels.',
        icon: 'ShieldCheck',
        displayOrder: 4,
        isActive: true,
        showOnHome: true,
        skills: [
          { name: 'JWT Authentication', slug: 'jwt-authentication', proficiencyPercentage: 88, icon: 'Key', shortDescription: 'HttpOnly cookie tokens, authorization headers, refresh token cycles, and CSRF protection.', displayOrder: 1, showOnHome: true, showInMarquee: false },
          { name: 'OAuth 2.0', slug: 'oauth-2-0', proficiencyPercentage: 78, icon: 'Shield', shortDescription: 'Standardized authorization flows for secure third-party resource delegation.', displayOrder: 2, showOnHome: false, showInMarquee: false },
          { name: 'Google OAuth', slug: 'google-oauth', proficiencyPercentage: 80, icon: 'UserCheck', shortDescription: 'Seamless Google single sign-on integration with server-side token verification.', displayOrder: 3, showOnHome: true, showInMarquee: false },
          { name: 'Role Based Access Control', slug: 'rbac', proficiencyPercentage: 82, icon: 'Lock', shortDescription: 'Granular permissions matrices and role validation for multi-tenant and admin systems.', displayOrder: 4, showOnHome: true, showInMarquee: false },
        ]
      },
      {
        name: 'Payments',
        slug: 'payments',
        description: 'Integrating reliable digital payment gateways, automated webhook reconciliation, and refund pipelines.',
        icon: 'CreditCard',
        displayOrder: 5,
        isActive: true,
        showOnHome: true,
        skills: [
          { name: 'Razorpay', slug: 'razorpay', proficiencyPercentage: 85, icon: 'Zap', shortDescription: 'Order creation, client checkout integration, and server HMAC-SHA256 signature verification.', displayOrder: 1, showOnHome: true, showInMarquee: false },
          { name: 'Stripe', slug: 'stripe', proficiencyPercentage: 70, icon: 'CreditCard', shortDescription: 'Payment Intent workflows, checkout sessions, and automated recurring billing.', displayOrder: 2, showOnHome: true, showInMarquee: false },
          { name: 'Payment Gateway Integration', slug: 'payment-gateway-integration', proficiencyPercentage: 82, icon: 'CreditCard', shortDescription: 'End-to-end checkout architectures with currency handling and transaction fallbacks.', displayOrder: 3, showOnHome: false, showInMarquee: false },
          { name: 'Webhook Handling', slug: 'webhook-handling', proficiencyPercentage: 72, icon: 'Layers', shortDescription: 'Idempotent asynchronous payment event listeners and order status synchronization.', displayOrder: 4, showOnHome: false, showInMarquee: false },
        ]
      },
      {
        name: 'DevOps & Deployment',
        slug: 'devops-deployment',
        description: 'Deploying reliable web applications with cloud hosting platforms, version control, and CDN infrastructure.',
        icon: 'Cloud',
        displayOrder: 6,
        isActive: true,
        showOnHome: false,
        skills: [
          { name: 'Git', slug: 'git', proficiencyPercentage: 88, icon: 'GitPullRequest', shortDescription: 'Distributed version control, branching strategies, rebasing, and merge management.', displayOrder: 1, showOnHome: false, showInMarquee: false },
          { name: 'GitHub', slug: 'github', proficiencyPercentage: 88, icon: 'GitPullRequest', shortDescription: 'Remote repository management, collaborative pull requests, code reviews, and actions.', displayOrder: 2, showOnHome: false, showInMarquee: true },
          { name: 'Render', slug: 'render', proficiencyPercentage: 85, icon: 'UploadCloud', shortDescription: 'Continuous cloud deployments for web services, background workers, and databases.', displayOrder: 3, showOnHome: false, showInMarquee: true },
          { name: 'Vercel', slug: 'vercel', proficiencyPercentage: 82, icon: 'Triangle', shortDescription: 'Optimized frontend deployments, automatic preview branches, and serverless edge functions.', displayOrder: 4, showOnHome: false, showInMarquee: true },
          { name: 'AWS', slug: 'aws', proficiencyPercentage: 65, icon: 'Cloud', shortDescription: 'EC2 cloud compute instances, security group configurations, and hosting foundations.', displayOrder: 5, showOnHome: false, showInMarquee: false },
          { name: 'Cloudinary', slug: 'cloudinary', proficiencyPercentage: 80, icon: 'UploadCloud', shortDescription: 'Automated media upload pipelines, on-the-fly image transformations, and CDN delivery.', displayOrder: 6, showOnHome: false, showInMarquee: true },
        ]
      },
      {
        name: 'Tools',
        slug: 'tools',
        description: 'Developer productivity toolchains, API testing suites, package registries, and UI/UX design tools.',
        icon: 'Tool',
        displayOrder: 7,
        isActive: true,
        showOnHome: false,
        skills: [
          { name: 'VS Code', slug: 'vs-code', proficiencyPercentage: 95, icon: 'Code', shortDescription: 'Customized code editing environment, workspace configurations, and debugging setups.', displayOrder: 1, showOnHome: false, showInMarquee: true },
          { name: 'Postman', slug: 'postman', proficiencyPercentage: 88, icon: 'Send', shortDescription: 'REST API testing, environment variable management, and automated test collections.', displayOrder: 2, showOnHome: false, showInMarquee: true },
          { name: 'npm', slug: 'npm', proficiencyPercentage: 90, icon: 'Layers', shortDescription: 'Node package ecosystem management, semantic versioning, and script orchestration.', displayOrder: 3, showOnHome: false, showInMarquee: false },
          { name: 'Figma', slug: 'figma', proficiencyPercentage: 65, icon: 'Figma', shortDescription: 'Interface design inspection, design-to-code translation, and UI layout wireframing.', displayOrder: 4, showOnHome: false, showInMarquee: true },
        ]
      }
    ];

    for (const catDef of categoryDefinitions) {
      const { skills: catSkills, ...catData } = catDef;
      
      // Idempotent upsert for category
      const categoryDoc = await SkillCategory.findOneAndUpdate(
        { slug: catData.slug },
        { $set: catData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      // Idempotent upsert for each skill under category
      for (const skillItem of catSkills) {
        await Skill.findOneAndUpdate(
          { slug: skillItem.slug, category: categoryDoc._id },
          {
            $set: {
              ...skillItem,
              category: categoryDoc._id,
              isActive: true,
            }
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }
    }

    console.log('Skill Categories and Skills seeded idempotently with required percentages & fields!');

    // 5. Seed Experience
    await Experience.deleteMany({});
    await Experience.create({
      company: 'Future By Catalyst',
      position: 'Full Stack Developer Intern (MERN)',
      startDate: 'Aug 2025',
      endDate: 'Present',
      description: [
        'Developing production-grade MERN stack applications with high maintainability, code modularity, and clean architectural separation.',
        'Designing and implementing robust RESTful APIs with comprehensive parameter validation, rate-limiting, and error-handling pipelines.',
        'Architecting secure authentication & authorization workflows leveraging JWT, HTTP-only cookies, Google OAuth 2.0, and Role-Based Access Control (RBAC).',
        'Engineering performant MongoDB database schemas, aggregation pipelines, indexing, and query optimizations using Mongoose ODM.',
        'Building full-featured MVC architectures and deploying full-stack web applications on cloud platforms including Vercel, Render, and AWS EC2 with Nginx reverse proxy configurations.'
      ],
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'JWT', 'RBAC', 'AWS EC2', 'Nginx', 'Socket.io'],
      order: 1,
    });
    console.log('Experience seeded.');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
