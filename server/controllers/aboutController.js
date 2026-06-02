import AboutUs from '../models/AboutUs.js';
import Family from '../models/Family.js';
import { handleImageUpload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

// Helper to get or create single AboutUs document
const getOrCreateAboutUs = async () => {
  let about = await AboutUs.findOne();
  if (!about) {
    about = await AboutUs.create({
      title: 'Our Family & Hospitality',
      subtitle: 'About Us',
      description: 'New Pittam Deurali Guest House & Restaurant was established as a welcoming stopover to share authentic Nepali hospitality, home-cooked food, and comfortable lodging with travelers from around the world.',
      image: '/uploads/image copy 8.png',
      storyTitle: 'A Heritage of Mountain Hospitality',
      storyDescription: 'Situated at 2,100 meters along the ridge-top of Pitam Deurali, our guest house has served as a trusted sanctuary for trekkers embarking on the Mardi Himal and Annapurna Base Camp routes. Managed as a family-run business, we focus on creating a cozy, warm, and inviting atmosphere where travelers can rest, refuel, and connect.',
      storyImage: '/uploads/image.png'
    });
  }
  return about;
};

// @desc    Get About Us content and Family members
// @route   GET /api/about
// @access  Public
export const getAboutData = async (req, res) => {
  try {
    const about = await getOrCreateAboutUs();
    const family = await Family.find({}).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, about, family });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update About Us details (Admin)
// @route   PUT /api/about
// @access  Private (Admin Only)
export const updateAboutData = async (req, res) => {
  try {
    const about = await getOrCreateAboutUs();
    const { title, subtitle, description, storyTitle, storyDescription } = req.body;

    if (title !== undefined) about.title = title;
    if (subtitle !== undefined) about.subtitle = subtitle;
    if (description !== undefined) about.description = description;
    if (storyTitle !== undefined) about.storyTitle = storyTitle;
    if (storyDescription !== undefined) about.storyDescription = storyDescription;

    // Handle files if uploaded (we can have 'image' and/or 'storyImage')
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        const uploadResult = await handleImageUpload(req.files.image[0]);
        if (uploadResult) {
          // unlink old file
          if (about.image && about.image.startsWith('/uploads/')) {
            const oldPath = path.join('./public/uploads', path.basename(about.image));
            if (fs.existsSync(oldPath)) {
              try { fs.unlinkSync(oldPath); } catch (e) {}
            }
          }
          about.image = uploadResult.url;
        }
      }
      if (req.files.storyImage && req.files.storyImage[0]) {
        const uploadResult = await handleImageUpload(req.files.storyImage[0]);
        if (uploadResult) {
          // unlink old file
          if (about.storyImage && about.storyImage.startsWith('/uploads/')) {
            const oldPath = path.join('./public/uploads', path.basename(about.storyImage));
            if (fs.existsSync(oldPath)) {
              try { fs.unlinkSync(oldPath); } catch (e) {}
            }
          }
          about.storyImage = uploadResult.url;
        }
      }
    }

    const updated = await about.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new family member (Admin)
// @route   POST /api/about/family
// @access  Private (Admin Only)
export const addFamilyMember = async (req, res) => {
  try {
    const { name, role, description, order } = req.body;
    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Please provide name and role' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    }

    const newMember = await Family.create({
      name,
      role,
      description: description || '',
      order: Number(order) || 0,
      image: imageUrl
    });

    res.status(201).json({ success: true, data: newMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update family member details (Admin)
// @route   PUT /api/about/family/:id
// @access  Private (Admin Only)
export const updateFamilyMember = async (req, res) => {
  try {
    const member = await Family.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Family member not found' });
    }

    const { name, role, description, order } = req.body;
    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (description !== undefined) member.description = description;
    if (order !== undefined) member.order = Number(order);

    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) {
        // unlink old file
        if (member.image && member.image.startsWith('/uploads/')) {
          const oldPath = path.join('./public/uploads', path.basename(member.image));
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) {}
          }
        }
        member.image = uploadResult.url;
      }
    }

    const updated = await member.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete family member (Admin)
// @route   DELETE /api/about/family/:id
// @access  Private (Admin Only)
export const deleteFamilyMember = async (req, res) => {
  try {
    const member = await Family.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Family member not found' });
    }

    // unlink image
    if (member.image && member.image.startsWith('/uploads/')) {
      const oldPath = path.join('./public/uploads', path.basename(member.image));
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) {}
      }
    }

    await Family.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Family member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
