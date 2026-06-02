import Review from '../models/Review.js';
import { handleImageUpload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

// @desc    Submit a new review (Public)
// @route   POST /api/reviews
// @access  Public
export const submitReview = async (req, res) => {
  try {
    const { guestName, country, rating, review } = req.body;
    if (!guestName || !rating || !review) {
      return res.status(400).json({ success: false, message: 'Please provide guestName, rating, and review' });
    }

    let imagePath = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) imagePath = uploadResult.url;
    }

    const newReview = await Review.create({
      guestName,
      country: country || '',
      rating: Number(rating),
      review,
      image: imagePath,
      status: 'Pending' // Always defaults to Pending for admin moderation
    });

    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully! It will appear on the website once approved by the property manager.',
      data: newReview 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all approved reviews (Public)
// @route   GET /api/reviews/approved
// @access  Public
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private (Admin Only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate a review (Admin)
// @route   PUT /api/reviews/:id/status
// @access  Private (Admin Only)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.status = status;
    const updated = await review.save();

    res.json({ success: true, message: `Review marked as ${status} successfully.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private (Admin Only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Delete image from local files if applicable
    if (review.image && review.image.startsWith('/uploads/')) {
      const filename = path.basename(review.image);
      const filePath = path.join('./public/uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Failed to delete review image:', err.message);
        }
      }
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
