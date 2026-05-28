import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Please add guest name'],
      trim: true,
    },
    guestImage: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Please specify rating (1-5)'],
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Please add review text'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
export default Testimonial;
