import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// Ensure the local uploads folder exists
const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Local Disk Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper/middleware to upload to Cloudinary if enabled
const handleImageUpload = async (file) => {
  if (!file) return null;
  
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'hotel_pokhara',
      });
      // Try to clean up local temp file after upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err.message);
      }
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      console.error('Cloudinary Upload Error, falling back to local file path:', error.message);
      // Fallback to local path relative URL
      return { url: `/uploads/${path.basename(file.path)}`, publicId: null };
    }
  } else {
    // If not using Cloudinary, return the static server path
    return { url: `/uploads/${path.basename(file.path)}`, publicId: null };
  }
};

export { upload, handleImageUpload };
