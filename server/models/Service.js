import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add service description'],
    },
    icon: {
      type: String, // icon class or image URL
      required: [true, 'Please specify an icon (e.g. bi-wifi or an image path)'],
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
