import Room from '../models/Room.js';
import { handleImageUpload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

// Helper function to create URL slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room by slug
// @route   GET /api/rooms/:slug
// @access  Public
export const getRoomBySlug = async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res) => {
  try {
    const { title, description, shortDescription, price, capacity, bedType, roomSize, featured, amenities } = req.body;

    if (!title || !description || !shortDescription || !price || !capacity || !bedType || !roomSize) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    // Process uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await handleImageUpload(file);
        if (uploadResult) imageUrls.push(uploadResult.url);
      }
    }

    if (imageUrls.length === 0) {
      // Fallback placeholder image
      imageUrls.push('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');
    }

    // Parse amenities
    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities = Array.isArray(amenities) ? amenities : JSON.parse(amenities);
    }

    const slug = slugify(title) + '-' + Math.floor(Math.random() * 1000);

    const room = await Room.create({
      title,
      slug,
      description,
      shortDescription,
      price: Number(price),
      capacity: Number(capacity),
      bedType,
      roomSize,
      featured: featured === 'true' || featured === true,
      amenities: parsedAmenities,
      images: imageUrls,
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const { title, description, shortDescription, price, capacity, bedType, roomSize, featured, amenities, existingImages, availability } = req.body;

    // Process new images if uploaded
    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages) ? existingImages : JSON.parse(existingImages);
    }

    // Delete removed images from local disk
    const removedImages = room.images.filter(img => !imageUrls.includes(img));
    for (const img of removedImages) {
      if (img.startsWith('/uploads/')) {
        const filename = path.basename(img);
        const filePath = path.join('./public/uploads', filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Failed to delete room image on update:', err.message);
          }
        }
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await handleImageUpload(file);
        if (uploadResult) imageUrls.push(uploadResult.url);
      }
    }

    // Parse amenities
    let parsedAmenities = amenities;
    if (amenities && typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (err) {
        parsedAmenities = amenities.split(',').map(a => a.trim());
      }
    }

    if (title) {
      room.title = title;
      room.slug = slugify(title) + '-' + room._id.toString().slice(-4);
    }
    if (description) room.description = description;
    if (shortDescription) room.shortDescription = shortDescription;
    if (price) room.price = Number(price);
    if (capacity) room.capacity = Number(capacity);
    if (bedType) room.bedType = bedType;
    if (roomSize) room.roomSize = roomSize;
    if (featured !== undefined) room.featured = featured === 'true' || featured === true;
    if (availability !== undefined) room.availability = availability === 'true' || availability === true;
    if (parsedAmenities !== undefined) room.amenities = parsedAmenities;
    if (imageUrls.length > 0) room.images = imageUrls;

    const updatedRoom = await room.save();
    res.json({ success: true, data: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Delete all local images associated with the room
    for (const img of room.images) {
      if (img.startsWith('/uploads/')) {
        const filename = path.basename(img);
        const filePath = path.join('./public/uploads', filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Failed to delete room image on delete:', err.message);
          }
        }
      }
    }
    
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
