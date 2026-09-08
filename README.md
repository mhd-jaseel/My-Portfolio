# Deployment & Production Run Guide: Mohammed Jaseel Portfolio & Admin CMS

This repository contains a full-stack personal developer portfolio and private admin CMS for **Mohammed Jaseel K**.

## 🌟 Key Architecture
- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, React Router, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT in HttpOnly cookies, bcryptjs, Helmet, Rate Limiting.
- **Media**: Multer, Sharp (WebP automatic compression), Cloudinary with local storage fallback.
- **Private Admin CMS**: Direct access via `/admin/login` — completely hidden from public navbar.

---

## 🚀 Local Development Setup

### 1. Backend Server Setup
From the repository root:
```bash
# Install dependencies
npm install

# Seed the database with all CV data and initial admin user
node server/seed.js

# Start backend server (runs on port 5000)
node server/server.js
```

### 2. Frontend Client Setup
From the `client/` folder:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` to explore the live application.

---

## 🔐 Admin Authentication Credentials
- **Admin Login Route**: `http://localhost:5173/admin/login`
- **Email**: `mohammejaseel90@gmail.com`
- **Default Password**: `AdminPassword2026!#` *(Configurable in `.env`)*

---

## 🌐 Production Deployment Guide

### A. Deploy Backend to Render
1. Connect your GitHub repository to Render.
2. Create a new **Web Service**:
   - **Root Directory**: `.`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
3. Add Environment Variables on Render:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Your Random Strong JWT Secret>`
   - `CLIENT_URL`: `https://your-portfolio-frontend.vercel.app`
   - `ADMIN_EMAIL`: `mohammejaseel90@gmail.com`
   - `ADMIN_PASSWORD`: `<Your Secure Password>`
   - *(Optional)* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### B. Deploy Frontend to Vercel
1. Connect repository to Vercel.
2. Set Root Directory to `client`.
3. Set Framework Preset to **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
5. Deploy.
