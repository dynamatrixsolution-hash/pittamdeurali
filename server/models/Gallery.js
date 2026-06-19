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
      enum: ['Guest House', 'Rooms', 'Restaurant', 'Surroundings', 'Facilities', '360 View'],
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
