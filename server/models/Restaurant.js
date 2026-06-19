import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      default: 'Traditional Nepali Dining Experience'
    },
    subtitle: {
      type: String,
      trim: true,
      default: 'Wood-fired organic meals on the Annapurna trails'
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      default: 'At New Pittam Deurali Guest House & Restaurant, dining is at the heart of our hospitality. Our family kitchen prepares every meal over a traditional wood-fired stove, imparting a rich, authentic smoky flavor to local dishes.'
    },
    features: {
      type: [String],
      default: ['Fresh Local Ingredients', 'Traditional Nepali Cuisine', 'Family Dining', 'Vegetarian Options']
    },
    coverImage: {
      type: String,
      default: ''
    },
    galleryImages: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
export default Restaurant;
