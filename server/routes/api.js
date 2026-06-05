import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload, handleImageUpload } from '../middleware/upload.js';

// Controller imports
import { loginAdmin, verifyAdmin, setupAdmin } from '../controllers/authController.js';
import { getHomepageCms, updateHomepageCms, getSettings, updateSettings } from '../controllers/cmsController.js';
import { getAllRooms, getRoomBySlug, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { getGalleryImages, uploadGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGallery } from '../controllers/galleryController.js';
import { createBooking, getBookings, updateBookingStatus, deleteBooking, createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/bookingController.js';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { getTreks, createTrek, updateTrek, deleteTrek, getTrekById } from '../controllers/trekController.js';
import { submitReview, getApprovedReviews, getAllReviews, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';
import { getRestaurant, updateRestaurant, addGalleryImages, deleteRestaurantGalleryImage } from '../controllers/restaurantController.js';
import { getAboutData, updateAboutData, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../controllers/aboutController.js';
import { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../controllers/menuController.js';
import { getHeroes, createHero, updateHero, deleteHero } from '../controllers/heroController.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/login', loginAdmin);
router.get('/auth/verify', protect, verifyAdmin);
router.post('/auth/setup', setupAdmin);

// --- Settings Routes ---
router.get('/settings', getSettings);
router.put('/settings', protect, updateSettings);

// --- General File Upload Route ---
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const uploaded = await handleImageUpload(req.file);
    res.json({ success: true, url: uploaded.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CMS Homepage Routes ---
router.get('/cms/homepage', getHomepageCms);
router.put('/cms/homepage', protect, updateHomepageCms);

// --- Hero Slide Routes ---
router.get('/heroes', getHeroes);
router.post('/heroes', protect, upload.single('image'), createHero);
router.put('/heroes/:id', protect, upload.single('image'), updateHero);
router.delete('/heroes/:id', protect, deleteHero);

// --- Room Routes ---
router.get('/rooms', getAllRooms);
router.get('/rooms/:slug', getRoomBySlug);
router.post('/rooms', protect, upload.array('images', 5), createRoom);
router.put('/rooms/:id', protect, upload.array('images', 5), updateRoom);
router.delete('/rooms/:id', protect, deleteRoom);

// --- Gallery Routes ---
router.get('/gallery', getGalleryImages);
router.post('/gallery', protect, upload.single('image'), uploadGalleryImage);
router.put('/gallery/:id', protect, upload.single('image'), updateGalleryImage);
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

// --- Restaurant Routes ---
router.get('/restaurant', getRestaurant);
router.put('/restaurant', protect, upload.single('coverImage'), updateRestaurant);
router.post('/restaurant/gallery', protect, upload.array('gallery', 10), addGalleryImages);
router.delete('/restaurant/gallery', protect, deleteRestaurantGalleryImage);

// --- About Us & Family Routes ---
router.get('/about', getAboutData);
router.put('/about', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'storyImage', maxCount: 1 }]), updateAboutData);
router.post('/about/family', protect, upload.single('image'), addFamilyMember);
router.put('/about/family/:id', protect, upload.single('image'), updateFamilyMember);
router.delete('/about/family/:id', protect, deleteFamilyMember);

// --- Trek Routes ---
router.get('/treks', getTreks);
router.get('/treks/:id', getTrekById);
router.post('/treks', protect, upload.single('image'), createTrek);
router.put('/treks/:id', protect, upload.single('image'), updateTrek);
router.delete('/treks/:id', protect, deleteTrek);

// --- Reviews Routes ---
router.get('/reviews', protect, getAllReviews);
router.get('/reviews/approved', getApprovedReviews);
router.post('/reviews', upload.single('image'), submitReview);
router.put('/reviews/:id/status', protect, updateReviewStatus);
router.delete('/reviews/:id', protect, deleteReview);

// --- Blog Routes ---
router.get('/blogs', getAllBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.post('/blogs', protect, upload.single('thumbnail'), createBlog);
router.put('/blogs/:id', protect, upload.single('thumbnail'), updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);

// --- Menu Categories Routes ---
router.get('/menu-categories', getCategories);
router.post('/menu-categories', protect, createCategory);
router.put('/menu-categories/:id', protect, updateCategory);
router.delete('/menu-categories/:id', protect, deleteCategory);

// --- Menu Items Routes ---
router.get('/menu-items', getMenuItems);
router.post('/menu-items', protect, upload.single('image'), createMenuItem);
router.put('/menu-items/:id', protect, upload.single('image'), updateMenuItem);
router.delete('/menu-items/:id', protect, deleteMenuItem);

export default router;
