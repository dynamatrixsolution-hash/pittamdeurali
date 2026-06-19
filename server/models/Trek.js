import mongoose from 'mongoose';

const TrekSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a trek name'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add a trek image'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please add difficulty level'],
      enum: ['Easy', 'Moderate', 'Hard', 'Challenging'],
    },
    duration: {
      type: String,
      required: [true, 'Please add trek duration'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add trek description'],
    },
    longDescription: {
      type: String,
      default: '',
    },
    itinerary: {
      type: String,
      default: '',
    },
    bestSeason: {
      type: String,
      default: '',
    },
    maxElevation: {
      type: String,
      default: '',
    },
    startPoint: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

const Trek = mongoose.model('Trek', TrekSchema);
export default Trek;
