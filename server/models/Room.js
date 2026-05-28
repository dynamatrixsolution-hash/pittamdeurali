import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a room title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a room description'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Please add a short description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price per night'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one room image'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      required: [true, 'Please add maximum capacity of guests'],
    },
    bedType: {
      type: String,
      required: [true, 'Please specify bed type (e.g. King, Queen, Twin)'],
    },
    roomSize: {
      type: String, // e.g. "45 sqm"
      required: [true, 'Please specify the room size'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', RoomSchema);
export default Room;
