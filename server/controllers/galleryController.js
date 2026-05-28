import Gallery from '../models/Gallery.js';
import { handleImageUpload } from '../middleware/upload.js';
import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryImages = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload new gallery image
// @route   POST /api/gallery
// @access  Private
export const uploadGalleryImage = async (req, res) => {
  try {
    const { category, caption, order } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Please specify an image category' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const uploadResult = await handleImageUpload(req.file);

    if (!uploadResult) {
      return res.status(500).json({ success: false, message: 'Failed to process image upload' });
    }

    const galleryItem = await Gallery.create({
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      category,
      caption: caption || '',
      order: order ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: galleryItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }

    // Delete image from Cloudinary if applicable
    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err.message);
      }
    } 
    // Delete image from local files if applicable
    else if (item.url.startsWith('/uploads/')) {
      const filename = path.basename(item.url);
      const filePath = path.join('./public/uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Failed to delete local file:', err.message);
        }
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reorder gallery images
// @route   PUT /api/gallery/reorder
// @access  Private
export const reorderGallery = async (req, res) => {
  try {
    const { orderings } = req.body; // Array of { id: string, order: number }

    if (!orderings || !Array.isArray(orderings)) {
      return res.status(400).json({ success: false, message: 'Please provide an array of orderings' });
    }

    for (const item of orderings) {
      await Gallery.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({ success: true, message: 'Gallery order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
