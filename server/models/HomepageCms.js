import mongoose from 'mongoose';

const HomepageCmsSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Unveil Luxury in Pokhara' },
      subtitle: { type: String, default: 'An oasis of tranquility surrounded by majestic Himalayan vistas.' },
      image: { type: String, default: '' },
      buttonText: { type: String, default: 'Explore Rooms' },
      buttonLink: { type: String, default: '/rooms' },
    },
    heroSlides: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        image: { type: String, required: true },
        buttonText: { type: String, default: 'Explore' },
        buttonLink: { type: String, default: '/rooms' },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
      }
    ],
    welcome: {
      title: { type: String, default: 'Welcome to Sanctum Retreat Pokhara' },
      subtitle: { type: String, default: 'Experience Luxury Coexisting with Nature' },
      description: { type: String, default: 'Nestled between Phewa Lake and the towering peaks of Annapurna, our hotel provides an immersive escape. Every room has been meticulously crafted to blend minimalist organic architecture with the warmth of local Nepalese hospitality.' },
      image: { type: String, default: '' },
    },
    roomsSection: {
      title: { type: String, default: 'Our Sanctuary Chambers' },
      subtitle: { type: String, default: 'Refined comfort and private balconies overlooking mountain reflection pools.' }
    },
    servicesSection: {
      title: { type: String, default: 'Curated Guest Amenities' },
      subtitle: { type: String, default: 'Designed to rejuvenate mind, body, and spirit during your stay.' }
    },
    testimonialsSection: {
      title: { type: String, default: 'Guest Reminiscences' },
      subtitle: { type: String, default: 'Stories from those who have crossed our threshold and found peace.' }
    },
    gallerySection: {
      title: { type: String, default: 'A Visual Chronicle' },
      subtitle: { type: String, default: 'Glimpses into our spaces, nature trails, and architectural details.' }
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const HomepageCms = mongoose.model('HomepageCms', HomepageCmsSchema);
export default HomepageCms;
