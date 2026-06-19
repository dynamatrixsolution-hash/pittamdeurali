import Hero from '../models/Hero.js';
import { handleImageUpload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all hero slides
// @route   GET /api/heroes
// @access  Public
export const getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({}).sort({ order: 1 });
    res.json({ success: true, count: heroes.length, data: heroes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a hero slide
// @route   POST /api/heroes
// @access  Private
export const createHero = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, order, active } = req.body;
    if (!title || !subtitle) {
      return res.status(400).json({ success: false, message: 'Title and Subtitle are required' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload a background image for this hero slide' });
    }

    const hero = await Hero.create({
      title,
      subtitle,
      imageUrl,
      buttonText: buttonText || 'Explore',
      buttonLink: buttonLink || '/rooms',
      order: order ? Number(order) : 0,
      active: active === 'true' || active === true
    });

    res.status(201).json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a hero slide
// @route   PUT /api/heroes/:id
// @access  Private
export const updateHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    const { title, subtitle, buttonText, buttonLink, order, active } = req.body;

    let imageUrl = hero.imageUrl;
    if (req.file) {
      // Delete old file if it exists locally
      if (hero.imageUrl && hero.imageUrl.startsWith('/uploads/')) {
        const oldFilename = path.basename(hero.imageUrl);
        const oldFilePath = path.join('./public/uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (err) {
            console.error('Failed to delete old hero image:', err.message);
          }
        }
      }

      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    }

    if (title !== undefined) hero.title = title;
    if (subtitle !== undefined) hero.subtitle = subtitle;
    if (buttonText !== undefined) hero.buttonText = buttonText;
    if (buttonLink !== undefined) hero.buttonLink = buttonLink;
    if (order !== undefined) hero.order = Number(order);
    if (active !== undefined) hero.active = active === 'true' || active === true;
    hero.imageUrl = imageUrl;

    const updated = await hero.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a hero slide
// @route   DELETE /api/heroes/:id
// @access  Private
export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    // Delete image from local files if applicable
    if (hero.imageUrl && hero.imageUrl.startsWith('/uploads/')) {
      const filename = path.basename(hero.imageUrl);
      const filePath = path.join('./public/uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Failed to delete hero image:', err.message);
        }
      }
    }

    await Hero.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
