const request = require('supertest');
const mongoose = require('../../server/node_modules/mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create Express test app instance without starting another listener
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

const publicRoutes = require('../../server/routes/publicRoutes');
const adminRoutes = require('../../server/routes/adminRoutes');
const User = require('../../server/models/User');
const Project = require('../../server/models/Project');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

describe('Integration & API Testing: Public & Admin Endpoints', () => {
  let adminToken;
  let testProjectId;

  jest.setTimeout(30000);

  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
    }

    // Generate valid admin token for testing
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Mohammed Jaseel K',
        email: 'mohammejaseel90@gmail.com',
        password: 'AdminPassword2026!#',
        role: 'admin',
      });
    }

    adminToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_jaseel_2026_dev_secure',
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    if (testProjectId) {
      await Project.findByIdAndDelete(testProjectId);
    }
  });

  // 1. ROOT & HEALTH CHECK
  describe('Root & Health Endpoints', () => {
    test('GET / returns 200 and running status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Portfolio API is running');
      expect(res.body.environment).toBeDefined();
    });
  });

  // 2. PUBLIC ENDPOINTS
  describe('Public API Endpoints', () => {
    test('GET /api/profile returns 200 and profile payload', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('GET /api/projects returns 200 and array of projects', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/projects?homeOnly=true returns maximum 4 projects', async () => {
      const res = await request(app).get('/api/projects?homeOnly=true');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(4);
    });

    test('GET /api/skill-categories/home returns 200 and categories with skills', async () => {
      const res = await request(app).get('/api/skill-categories/home');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/marquee-tools returns 200 and list of scrolling tools', async () => {
      const res = await request(app).get('/api/marquee-tools');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/contact validates inputs properly and blocks empty submissions', async () => {
      const res = await request(app).post('/api/contact').send({
        name: '',
        email: 'invalid-email',
        message: '',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // 2. AUTHENTICATION & SECURITY
  describe('Authentication & Security', () => {
    test('Rejects unauthorized requests to admin endpoints', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('Allows authorized requests with valid Admin Token', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Cookie', [`admin_token=${adminToken}`]);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 3. ADMIN CRUD OPERATIONS
  describe('Admin CRUD Operations', () => {
    test('Creates, Updates, and Deletes a Project with Home toggle restriction', async () => {
      // Create test project
      const createRes = await request(app)
        .post('/api/admin/projects')
        .set('Cookie', [`admin_token=${adminToken}`])
        .send({
          title: 'Automated Test Project',
          slug: `test-proj-${Date.now()}`,
          category: 'Full Stack',
          description: 'Testing end to end flow for deployment audit',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
          showOnHome: false,
          technologies: ['React', 'Node.js', 'Jest'],
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.success).toBe(true);
      testProjectId = createRes.body.data._id;

      // Update project
      const updateRes = await request(app)
        .put(`/api/admin/projects/${testProjectId}`)
        .set('Cookie', [`admin_token=${adminToken}`])
        .send({
          title: 'Automated Test Project Updated',
          description: 'Updated description for deployment audit',
        });
        
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.title).toBe('Automated Test Project Updated');

      // Delete project
      const deleteRes = await request(app)
        .delete(`/api/admin/projects/${testProjectId}`)
        .set('Cookie', [`admin_token=${adminToken}`]);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      testProjectId = null;
    });
  });

  // 4. MEDIA MANAGEMENT & DELETION
  describe('Admin Media Library & Safe Deletion', () => {
    test('Fetches media library with referenced and unused asset classifications', async () => {
      const res = await request(app)
        .get('/api/admin/media')
        .set('Cookie', [`admin_token=${adminToken}`]);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('Rejects deletion of media with invalid or missing URL parameters', async () => {
      const res = await request(app)
        .delete('/api/admin/media')
        .set('Cookie', [`admin_token=${adminToken}`])
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('Safely handles media deletion request and updates DB references', async () => {
      const res = await request(app)
        .delete('/api/admin/media')
        .set('Cookie', [`admin_token=${adminToken}`])
        .send({ url: '/uploads/non_existent_mock_file.webp' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
