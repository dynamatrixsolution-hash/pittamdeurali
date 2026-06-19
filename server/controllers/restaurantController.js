import Restaurant from '../models/Restaurant.js';
import { handleImageUpload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

// Helper to get or create the single restaurant document
const getOrCreateRestaurant = async () => {
  let restaurant = await Restaurant.findOne();
  if (!restaurant) {
    restaurant = await Restaurant.create({
      title: 'Traditional Nepali Dining Experience',
      subtitle: 'Wood-fired organic meals on the Annapurna trails',
      description: 'At New Pittam Deurali Guest House & Restaurant, dining is at the heart of our hospitality. Our family kitchen prepares every meal over a traditional wood-fired stove, imparting a rich, authentic smoky flavor to local dishes.',
      features: ['Fresh Local Ingredients', 'Traditional Nepali Cuisine', 'Family Dining', 'Vegetarian Options'],
      coverImage: '',
      galleryImages: []
    });
  }
  return restaurant;
};

// @desc    Get restaurant details (Public/Admin)
// @route   GET /api/restaurant
// @access  Public
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await getOrCreateRestaurant();
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update restaurant texts & cover image (Admin)
// @route   PUT /api/restaurant
// @access  Private (Admin Only)
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await getOrCreateRestaurant();
    const { title, subtitle, description, features } = req.body;

    if (title !== undefined) restaurant.title = title;
    if (subtitle !== undefined) restaurant.subtitle = subtitle;
    if (description !== undefined) restaurant.description = description;
    
    if (features !== undefined) {
      // features might be sent as JSON string or array
      if (typeof features === 'string') {
        try {
          restaurant.features = JSON.parse(features);
        } catch (e) {
          restaurant.features = features.split(',').map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(features)) {
        restaurant.features = features;
      }
    }

    // Handle single cover image upload
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) {
        // Delete old cover image from disk if it exists
        if (restaurant.coverImage && restaurant.coverImage.startsWith('/uploads/')) {
          const filename = path.basename(restaurant.coverImage);
          const oldPath = path.join('./public/uploads', filename);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Failed to delete old cover image:', err.message);
            }
          }
        }
        restaurant.coverImage = uploadResult.url;
      }
    }

    const updated = await restaurant.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add multiple images to restaurant gallery (Admin)
// @route   POST /api/restaurant/gallery
// @access  Private (Admin Only)
export const addGalleryImages = async (req, res) => {
  try {
    const restaurant = await getOrCreateRestaurant();
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const newUrls = [];
    for (const file of req.files) {
      const uploadResult = await handleImageUpload(file);
      if (uploadResult) {
        newUrls.push(uploadResult.url);
      }
    }

    restaurant.galleryImages = [...restaurant.galleryImages, ...newUrls];
    const updated = await restaurant.save();

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a specific gallery image (Admin)
// @route   DELETE /api/restaurant/gallery
// @access  Private (Admin Only)
export const deleteRestaurantGalleryImage = async (req, res) => {
  try {
    const restaurant = await getOrCreateRestaurant();
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'imageUrl is required in body' });
    }

    // Remove from array
    restaurant.galleryImages = restaurant.galleryImages.filter(url => url !== imageUrl);
    await restaurant.save();

    // Delete local file
    if (imageUrl.startsWith('/uploads/')) {
      const filename = path.basename(imageUrl);
      const filePath = path.join('./public/uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Failed to delete gallery image file:', err.message);
        }
      }
    }

    res.json({ success: true, message: 'Gallery image deleted successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
