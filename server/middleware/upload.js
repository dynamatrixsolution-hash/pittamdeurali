import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

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

// File filter (accept images/videos only)
const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|webp|gif|mp4|mov|webm|avi|mkv/;
  const allowedMime = /image\/|video\//;
  const extName = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedMime.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for images/videos
});

// Helper/middleware to upload media to Cloudinary, or save local image path as fallback
const handleImageUpload = async (file) => {
  if (!file) return null;

  if (hasCloudinaryConfig) {
    const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'pittamdeurali',
      resource_type: resourceType
    });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return { url: result.secure_url, publicId: result.public_id };
  }

  return { url: `/uploads/${path.basename(file.path)}`, publicId: null };
};

export { upload, handleImageUpload };
