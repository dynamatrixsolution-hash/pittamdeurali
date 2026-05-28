import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Please add image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please add image category'],
      enum: ['Rooms', 'Exterior', 'Restaurant', 'Lobby', 'Pokhara Views', 'Events'],
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    publicId: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model('Gallery', GallerySchema);
export default Gallery;
