import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an experience title'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image for this experience'],
    },
    description: {
      type: String,
      required: [true, 'Please add experience description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add pricing details'],
    }
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model('Experience', ExperienceSchema);
export default Experience;
