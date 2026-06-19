import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    guestName: {
      type: String,
      required: [true, 'Please add guest name'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, 'Please add guest email'],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    guestPhone: {
      type: String,
      required: [true, 'Please add contact phone number'],
    },
    guestsCount: {
      type: Number,
      required: [true, 'Please specify guest count'],
      min: 1,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please specify check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please specify check-out date'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'CheckedIn', 'CheckedOut'],
      default: 'Pending',
    },
    message: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
