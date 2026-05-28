import Experience from '../models/Experience.js';
import { handleImageUpload } from '../middleware/upload.js';

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'; // default Pokhara lake view
    }

    const experience = await Experience.create({
      title,
      description,
      price: Number(price),
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    const { title, description, price } = req.body;
    
    let imageUrl = experience.image;
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imageUrl = uploadResult.url;
    }

    if (title) experience.title = title;
    if (description) experience.description = description;
    if (price) experience.price = Number(price);
    experience.image = imageUrl;

    const updated = await experience.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
