import Gallery from '../models/Gallery.js';
import { handleImageUpload } from '../middleware/upload.js';
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

// @desc    Update gallery image (Replace file, caption, category, order)
// @route   PUT /api/gallery/:id
// @access  Private
export const updateGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }

    const { category, caption, order } = req.body;

    if (category) item.category = category;
    if (caption !== undefined) item.caption = caption;
    if (order !== undefined) item.order = Number(order);

    if (req.file) {
      // Delete old local file if it exists
      if (item.url && item.url.startsWith('/uploads/')) {
        const oldFilename = path.basename(item.url);
        const oldFilePath = path.join('./public/uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (err) {
            console.error('Failed to delete old local file:', err.message);
          }
        }
      }

      // Upload new file
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) {
        item.url = uploadResult.url;
      }
    }

    const updated = await item.save();
    res.json({ success: true, data: updated });
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

    // Delete image from local files if applicable
    if (item.url && item.url.startsWith('/uploads/')) {
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
