import Booking from '../models/Booking.js';
import Inquiry from '../models/Inquiry.js';
import Room from '../models/Room.js';

// Helper to generate a nice booking ID
const generateBookingId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SR-${dateStr}-${rand}`;
};

// @desc    Submit a room booking inquiry
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { room: roomId, guestName, guestEmail, guestPhone, guestsCount, checkIn, checkOut, message } = req.body;

    if (!roomId || !guestName || !guestEmail || !guestPhone || !guestsCount || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'Please provide all required reservation fields' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Selected room not found' });
    }

    // Calculate total price
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (days <= 0) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const totalPrice = room.price * days;
    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      room: roomId,
      guestName,
      guestEmail,
      guestPhone,
      guestsCount: Number(guestsCount),
      checkIn: start,
      checkOut: end,
      totalPrice,
      message: message || '',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('room', 'title price').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please specify new booking status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    const updated = await booking.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking record (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit general contact inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, guestsCount, checkIn, checkOut, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please enter name, email, and message' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || '',
      guestsCount: guestsCount ? Number(guestsCount) : 1,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      message,
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/inquiries/:id
// @access  Private
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please specify new inquiry status' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inquiry.status = status;
    const updated = await inquiry.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
// @access  Private
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
