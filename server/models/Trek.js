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
    }
  },
  {
    timestamps: true,
  }
);

const Trek = mongoose.model('Trek', TrekSchema);
export default Trek;
