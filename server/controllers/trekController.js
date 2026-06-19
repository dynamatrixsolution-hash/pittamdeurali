import Trek from '../models/Trek.js';
import { handleImageUpload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all treks
// @route   GET /api/treks
// @access  Public
export const getTreks = async (req, res) => {
  try {
    const treks = await Trek.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: treks.length, data: treks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a trek
// @route   POST /api/treks
// @access  Private
export const createTrek = async (req, res) => {
  try {
    const { name, difficulty, duration, description, longDescription, itinerary, bestSeason, maxElevation, startPoint } = req.body;
    if (!name || !difficulty || !duration || !description) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'; // default lake view
    }

    const trek = await Trek.create({
      name,
      difficulty,
      duration,
      description,
      longDescription: longDescription || '',
      itinerary: itinerary || '',
      bestSeason: bestSeason || '',
      maxElevation: maxElevation || '',
      startPoint: startPoint || '',
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: trek });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a trek
// @route   PUT /api/treks/:id
// @access  Private
export const updateTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ success: false, message: 'Trek not found' });
    }

    const { name, difficulty, duration, description, longDescription, itinerary, bestSeason, maxElevation, startPoint } = req.body;
    
    let imageUrl = trek.image;
    if (req.file) {
      // Delete old file if it exists locally
      if (trek.image && trek.image.startsWith('/uploads/')) {
        const oldFilename = path.basename(trek.image);
        const oldFilePath = path.join('./public/uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (err) {
            console.error('Failed to delete old trek image:', err.message);
          }
        }
      }

      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    }

    if (name) trek.name = name;
    if (difficulty) trek.difficulty = difficulty;
    if (duration) trek.duration = duration;
    if (description) trek.description = description;
    trek.longDescription = longDescription !== undefined ? longDescription : trek.longDescription;
    trek.itinerary = itinerary !== undefined ? itinerary : trek.itinerary;
    trek.bestSeason = bestSeason !== undefined ? bestSeason : trek.bestSeason;
    trek.maxElevation = maxElevation !== undefined ? maxElevation : trek.maxElevation;
    trek.startPoint = startPoint !== undefined ? startPoint : trek.startPoint;
    trek.image = imageUrl;

    const updated = await trek.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a trek
// @route   DELETE /api/treks/:id
// @access  Private
export const deleteTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ success: false, message: 'Trek not found' });
    }

    // Delete image from local files if applicable
    if (trek.image && trek.image.startsWith('/uploads/')) {
      const filename = path.basename(trek.image);
      const filePath = path.join('./public/uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Failed to delete trek image:', err.message);
        }
      }
    }

    await Trek.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Trek deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single trek by ID
// @route   GET /api/treks/:id
// @access  Public
export const getTrekById = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) {
      return res.status(404).json({ success: false, message: 'Trek not found' });
    }
    res.json({ success: true, data: trek });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
