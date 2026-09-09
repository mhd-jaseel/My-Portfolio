const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Check whether Cloudinary credentials are fully configured
const isCloudinaryConfigured = () => {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim()) return true;
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME.trim() &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY.trim() &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET.trim()
  );
};

// Configure Cloudinary if keys exist
if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim()) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
      api_key: process.env.CLOUDINARY_API_KEY.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    });
  }
}

// Memory storage for file processing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') || 
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Please upload a valid image, video (MP4, WebM, MOV), or PDF file.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max for video files
  fileFilter,
});

// Process file and upload to Cloudinary or save locally
const processAndUpload = async (fileOrBuffer, originalName, mimeType, folder = 'jaseel_portfolio') => {
  let fileBuffer, name, type, targetFolder;

  // Handle if first argument is a Multer file object
  if (fileOrBuffer && fileOrBuffer.buffer) {
    fileBuffer = fileOrBuffer.buffer;
    name = fileOrBuffer.originalname || 'file';
    type = fileOrBuffer.mimetype || 'application/octet-stream';
    targetFolder = originalName || folder || 'jaseel_portfolio';
  } else {
    fileBuffer = fileOrBuffer;
    name = originalName || 'file';
    type = mimeType || 'application/octet-stream';
    targetFolder = folder || 'jaseel_portfolio';
  }

  const hasCloudinary = isCloudinaryConfigured();

  // In production, require persistent storage so images never get wiped
  if (!hasCloudinary && process.env.NODE_ENV === 'production') {
    throw new Error(
      'Permanent cloud storage (Cloudinary) is not configured on the production server. ' +
      'Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your server environment variables.'
    );
  }

  if (!hasCloudinary) {
    console.warn('[WARN] CLOUDINARY credentials not configured. Saving to local /uploads directory. Note: Local files do not persist across container redeployments.');
  }

  // 1. VIDEO HANDLING (MP4, WebM, MOV, etc.)
  if (type.startsWith('video/')) {
    if (hasCloudinary) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: targetFolder,
            resource_type: 'video',
            chunk_size: 6000000,
            quality: 'auto:best', // Preserves crystal-clear video quality
          },
          (error, result) => {
            if (error) return reject(new Error(`Cloudinary video upload failed: ${error.message}`));
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    } else {
      const uploadDir = path.join(__dirname, '..', 'uploads', 'videos');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const ext = path.extname(name) || '.mp4';
      const filename = `video-${Date.now()}-${path.parse(name).name.replace(/\s+/g, '_')}${ext}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, fileBuffer);
      return `/uploads/videos/${filename}`;
    }
  }

  // 2. PDF HANDLING
  if (type === 'application/pdf') {
    if (hasCloudinary) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: targetFolder, resource_type: 'raw' },
          (error, result) => {
            if (error) return reject(new Error(`Cloudinary PDF upload failed: ${error.message}`));
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    } else {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, fileBuffer);
      return `/uploads/${filename}`;
    }
  }

  // 3. SVG HANDLING (Preserve vector SVG content)
  if (type === 'image/svg+xml' || (typeof name === 'string' && name.toLowerCase().endsWith('.svg'))) {
    if (hasCloudinary) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: targetFolder, resource_type: 'raw', format: 'svg' },
          (error, result) => {
            if (error) return reject(new Error(`Cloudinary SVG upload failed: ${error.message}`));
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    } else {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${path.parse(name).name.replace(/\s+/g, '_')}.svg`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, fileBuffer);
      return `/uploads/${filename}`;
    }
  }

  // 4. IMAGE OPTIMIZATION (with Sharp to WebP for PNG/JPG/WEBP)
  const optimizedBuffer = await sharp(fileBuffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  if (hasCloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: targetFolder, format: 'webp' },
        (error, result) => {
          if (error) return reject(new Error(`Cloudinary image upload failed: ${error.message}`));
          resolve(result.secure_url);
        }
      );
      uploadStream.end(optimizedBuffer);
    });
  } else {
    // Fallback to local storage (only in non-production development)
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${path.parse(name).name.replace(/\s+/g, '_')}.webp`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, optimizedBuffer);
    return `/uploads/${filename}`;
  }
};

/**
 * Safely delete a media file from local filesystem or Cloudinary
 * @param {string} fileUrlOrPath - The stored URL or relative path (/uploads/...)
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const deleteMediaFile = async (fileUrlOrPath) => {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') {
    return { success: false, message: 'Invalid file path' };
  }

  try {
    // 1. Local Server Storage Deletion (/uploads/...)
    if (fileUrlOrPath.startsWith('/uploads/') || fileUrlOrPath.startsWith('uploads/')) {
      const cleanRelativePath = fileUrlOrPath.replace(/^\/+/, ''); // e.g. "uploads/videos/xyz.mp4" or "uploads/xyz.webp"
      const uploadsRoot = path.resolve(__dirname, '..', 'uploads');
      const absoluteTarget = path.resolve(__dirname, '..', cleanRelativePath);

      // Security check: Prevent path traversal outside the uploads directory
      if (!absoluteTarget.startsWith(uploadsRoot)) {
        return { success: false, message: 'Access denied: Target path outside uploads directory' };
      }

      if (fs.existsSync(absoluteTarget)) {
        await fs.promises.unlink(absoluteTarget);
        return { success: true, message: 'Local file deleted successfully' };
      }
      return { success: true, message: 'File not found on disk (already removed)' };
    }

    // 2. Cloudinary Storage Deletion (https://res.cloudinary.com/...)
    if (fileUrlOrPath.includes('cloudinary.com') && isCloudinaryConfigured()) {
      // Extract Cloudinary public_id and resource_type
      // e.g., https://res.cloudinary.com/demo/image/upload/v12345/jaseel_portfolio/profile/image.webp
      const matches = fileUrlOrPath.match(/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      if (matches && matches[1]) {
        const publicId = matches[1];
        let resourceType = 'image';
        if (fileUrlOrPath.includes('/video/upload/')) resourceType = 'video';
        if (fileUrlOrPath.includes('/raw/upload/') || fileUrlOrPath.endsWith('.pdf') || fileUrlOrPath.endsWith('.svg')) {
          resourceType = 'raw';
        }

        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
        return { success: true, message: 'Cloudinary asset deleted', result };
      }
    }

    return { success: true, message: 'External URL or no storage action required' };
  } catch (err) {
    console.error('Error deleting media file:', err);
    return { success: false, message: err.message };
  }
};

module.exports = { upload, processAndUpload, deleteMediaFile, isCloudinaryConfigured };


