import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

// Controller imports
import { loginAdmin, verifyAdmin, setupAdmin } from '../controllers/authController.js';
import { getHomepageCms, updateHomepageCms, getSettings, updateSettings } from '../controllers/cmsController.js';
import { getAllRooms, getRoomBySlug, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage, reorderGallery } from '../controllers/galleryController.js';
import { createBooking, getBookings, updateBookingStatus, deleteBooking, createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/bookingController.js';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { getTestimonials, createTestimonial, approveTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/login', loginAdmin);
router.get('/auth/verify', protect, verifyAdmin);
router.post('/auth/setup', setupAdmin);

// --- Settings Routes ---
router.get('/settings', getSettings);
router.put('/settings', protect, updateSettings);

// --- CMS Homepage Routes ---
router.get('/cms/homepage', getHomepageCms);
router.put('/cms/homepage', protect, updateHomepageCms);

// --- Room Routes ---
router.get('/rooms', getAllRooms);
router.get('/rooms/:slug', getRoomBySlug);
router.post('/rooms', protect, upload.array('images', 5), createRoom);
router.put('/rooms/:id', protect, upload.array('images', 5), updateRoom);
router.delete('/rooms/:id', protect, deleteRoom);

// --- Gallery Routes ---
router.get('/gallery', getGalleryImages);
router.post('/gallery', protect, upload.single('image'), uploadGalleryImage);
router.delete('/gallery/:id', protect, deleteGalleryImage);
router.put('/gallery/reorder', protect, reorderGallery);

// --- Booking Routes ---
router.get('/bookings', protect, getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id', protect, updateBookingStatus);
router.delete('/bookings/:id', protect, deleteBooking);

// --- Inquiry Routes ---
router.get('/inquiries', protect, getInquiries);
router.post('/inquiries', createInquiry);
router.put('/inquiries/:id', protect, updateInquiryStatus);
router.delete('/inquiries/:id', protect, deleteInquiry);

// --- Services Routes ---
router.get('/services', getServices);
router.post('/services', protect, createService);
router.put('/services/:id', protect, updateService);
router.delete('/services/:id', protect, deleteService);

// --- Experiences Routes ---
router.get('/experiences', getExperiences);
router.post('/experiences', protect, upload.single('image'), createExperience);
router.put('/experiences/:id', protect, upload.single('image'), updateExperience);
router.delete('/experiences/:id', protect, deleteExperience);

// --- Testimonials Routes ---
router.get('/testimonials', getTestimonials);
router.post('/testimonials', upload.single('guestImage'), createTestimonial);
router.put('/testimonials/:id/approve', protect, approveTestimonial);
router.delete('/testimonials/:id', protect, deleteTestimonial);

// --- Blog Routes ---
router.get('/blogs', getAllBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.post('/blogs', protect, upload.single('thumbnail'), createBlog);
router.put('/blogs/:id', protect, upload.single('thumbnail'), updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);

export default router;
