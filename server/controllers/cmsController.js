import HomepageCms from '../models/HomepageCms.js';
import Settings from '../models/Settings.js';

// Helper to get or create homepage document
const getOrCreateHomepage = async () => {
  let homepage = await HomepageCms.findOne();
  if (!homepage) {
    homepage = await HomepageCms.create({
      faqs: [
        { question: 'What is the check-in and check-out time?', answer: 'Check-in is from 2:00 PM, and check-out is until 12:00 PM.' },
        { question: 'Do you offer airport transfer services?', answer: 'Yes, we offer complimentary luxury shuttle service to and from Pokhara International Airport. Please provide your flight details in advance.' },
        { question: 'What is your cancellation policy?', answer: 'Cancellations made 7 days or more before the check-in date will receive a full refund. Cancellations within 7 days are non-refundable.' }
      ]
    });
  }
  return homepage;
};

// Helper to get or create settings document
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// @desc    Get homepage CMS configurations
// @route   GET /api/cms/homepage
// @access  Public
export const getHomepageCms = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    res.json({ success: true, data: homepage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update homepage CMS configurations
// @route   PUT /api/cms/homepage
// @access  Private
export const updateHomepageCms = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    
    // Update individual sections if they are present in body
    if (req.body.hero) homepage.hero = { ...homepage.hero, ...req.body.hero };
    if (req.body.welcome) homepage.welcome = { ...homepage.welcome, ...req.body.welcome };
    if (req.body.roomsSection) homepage.roomsSection = { ...homepage.roomsSection, ...req.body.roomsSection };
    if (req.body.servicesSection) homepage.servicesSection = { ...homepage.servicesSection, ...req.body.servicesSection };
    if (req.body.experiencesSection) homepage.experiencesSection = { ...homepage.experiencesSection, ...req.body.experiencesSection };
    if (req.body.testimonialsSection) homepage.testimonialsSection = { ...homepage.testimonialsSection, ...req.body.testimonialsSection };
    if (req.body.gallerySection) homepage.gallerySection = { ...homepage.gallerySection, ...req.body.gallerySection };
    if (req.body.faqs) homepage.faqs = req.body.faqs;

    const updated = await homepage.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get global hotel settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update global hotel settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    
    // Update fields
    const fields = [
      'hotelName', 'address', 'phone', 'email', 'whatsappNumber',
      'googleMapIframe', 'facebookUrl', 'instagramUrl', 'tripAdvisorUrl'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    const updated = await settings.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
