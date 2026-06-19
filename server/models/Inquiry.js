import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    guestsCount: {
      type: Number,
      default: 1,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Please add message content'],
    },
    status: {
      type: String,
      enum: ['Unread', 'Read', 'Archived'],
      default: 'Unread',
    }
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
