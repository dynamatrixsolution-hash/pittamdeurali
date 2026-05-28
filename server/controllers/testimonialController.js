import Testimonial from '../models/Testimonial.js';
import { handleImageUpload } from '../middleware/upload.js';

// @desc    Get testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const { approvedOnly } = req.query;
    const filter = approvedOnly === 'true' ? { isApproved: true } : {};
    
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit guest testimonial
// @route   POST /api/testimonials
// @access  Public
export const createTestimonial = async (req, res) => {
  try {
    const { guestName, country, rating, reviewText } = req.body;
    if (!guestName || !rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please enter guest name, rating, and review text' });
    }

    let guestImageUrl = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) guestImageUrl = uploadResult.url;
    } else {
      // Default anonymous avatar
      guestImageUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    }

    const testimonial = await Testimonial.create({
      guestName,
      country: country || 'Traveler',
      rating: Number(rating),
      reviewText,
      guestImage: guestImageUrl,
      isApproved: false, // Moderated by default, admin must approve
    });

    res.status(201).json({ success: true, data: testimonial, message: 'Review submitted successfully. It will display once approved by the administrator.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/toggle visibility of testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private
export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonial.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : !testimonial.isApproved;
    const updated = await testimonial.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
