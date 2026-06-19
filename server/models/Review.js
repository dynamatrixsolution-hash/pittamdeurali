import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true
    },
    country: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating (1-5)'],
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: [true, 'Please provide a review message']
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
