import mongoose from 'mongoose';

const FamilySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Please provide a role'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Family = mongoose.model('Family', FamilySchema);
export default Family;
