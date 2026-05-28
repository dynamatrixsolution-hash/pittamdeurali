import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Room from './models/Room.js';
import Gallery from './models/Gallery.js';
import Service from './models/Service.js';
import Experience from './models/Experience.js';
import Testimonial from './models/Testimonial.js';
import Blog from './models/Blog.js';
import Settings from './models/Settings.js';
import HomepageCms from './models/HomepageCms.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_pokhara');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional, but good for resetting)
    await Admin.deleteMany({});
    await Room.deleteMany({});
    await Gallery.deleteMany({});
    await Service.deleteMany({});
    await Experience.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});
    await Settings.deleteMany({});
    await HomepageCms.deleteMany({});
    console.log('Cleaned database collections.');

    // 1. Create Default Admin
    // Password will be hashed in the pre-save hook
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@sanctumpokhara.com',
      name: 'Sanctum Manager',
    });
    console.log('Seeded: Admin user (admin / admin123)');

    // 2. Create Global Settings
    await Settings.create({
      hotelName: 'Sanctum Retreat Pokhara',
      address: 'Lakeside Road, Ward 6, Pokhara 33700, Nepal',
      phone: '+977-61-460000',
      email: 'stay@sanctumpokhara.com',
      whatsappNumber: '9779801234567',
      googleMapIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56214.99648937984!2d83.92989126300407!3d28.2107872658826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995937bbf0347fd%3A0x8a23072ab83b4b8a!2sPokhara!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp',
      facebookUrl: 'https://facebook.com/sanctumpokhara',
      instagramUrl: 'https://instagram.com/sanctumpokhara',
      tripAdvisorUrl: 'https://tripadvisor.com',
    });
    console.log('Seeded: Settings');

    // 3. Create Homepage CMS Text Content
    await HomepageCms.create({
      hero: {
        title: 'Unveil Pure Sanctuary',
        subtitle: 'Experience the heights of luxury coexisting with the wild majesty of Pokhara\'s lakes and peaks.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
        buttonText: 'Reserve Your Sanctuary',
        buttonLink: '/rooms',
      },
      welcome: {
        title: 'Welcome to Sanctum Retreat',
        subtitle: 'A Symphony of Stone, Water, and Himalayan Sky',
        description: 'Nestled on the serene edges of Phewa Lake, Sanctum Retreat represents the pinnacle of modern organic luxury. Our architecture integrates sustainable local slate and timber, offering minimalist luxury spaces that reflect the stillness of the waters and the heights of the Annapurna range. Here, guest wellness is curated by hand—from biodynamic farm-to-table cuisine to holistic healing arts.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      },
      roomsSection: {
        title: 'Sanctuary Chambers',
        subtitle: 'Quiet spaces of stone and silk with private heated pools and unrestricted lake views.'
      },
      servicesSection: {
        title: 'Refined Experiences',
        subtitle: 'Curated additions to bring peace to your body and clarity to your mind.'
      },
      experiencesSection: {
        title: 'Pokhara Expeditions',
        subtitle: 'Let our experienced local concierges guide you through the raw majesty of Pokhara.'
      },
      testimonialsSection: {
        title: 'Guest Journals',
        subtitle: 'Shared impressions from our luxury travelers across the globe.'
      },
      gallerySection: {
        title: 'Visual Chronicle',
        subtitle: 'Explore our gardens, wellness rooms, organic architecture, and lakeside trails.'
      },
      faqs: [
        {
          question: 'How do we reach the hotel from Pokhara Airport?',
          answer: 'We provide complimentary transfers in our private electric SUVs. Simply coordinate your arrival details with our guest relations team 24 hours prior to landing.'
        },
        {
          question: 'Are guided trekking activities included?',
          answer: 'We offer both complimentary morning lakeside walks and bespoke guided day treks (including paragliding and helicopter excursions) which can be booked through the experiences desk.'
        },
        {
          question: 'What is the culinary philosophy at Sanctum?',
          answer: 'Our kitchens operate on a strict farm-to-table philosophy. 80% of our ingredients are sourced from our private biodynamic garden or local Pokhara organic cooperatives, focusing on clean, vibrant flavors.'
        }
      ]
    });
    console.log('Seeded: Homepage CMS details');

    // 4. Create Luxury Rooms
    await Room.create([
      {
        title: 'Phewa Lakefront Pavilion',
        slug: 'phewa-lakefront-pavilion',
        shortDescription: 'Minimalist glass pavilion floating over reflecting pools on Phewa Lake.',
        description: 'The Phewa Lakefront Pavilion offers the ultimate in serene water living. Constructed using local slate and rich teakwood, it features glass doors that open completely to a private timber deck and heated plunge pool. Guests enjoy a king-size floating bed, organic linens, a basalt soaking tub, and writing desks with direct views of the Fishtail Mountain reflecting off the lake surface.',
        price: 320,
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Private Plunge Pool', 'Personal Butler', 'Airport Transfer', 'Basalt Tub', 'Yoga Mat', 'Espresso Bar', 'Free Wi-Fi'],
        capacity: 2,
        bedType: 'King Imperial',
        roomSize: '65 sqm',
        featured: true,
        availability: true
      },
      {
        title: 'Annapurna Vista Suite',
        slug: 'annapurna-vista-suite',
        shortDescription: 'Elevated stone suite featuring panoramic mountain views and open hearth.',
        description: 'Perched on the highest point of the retreat, the Annapurna Vista Suite provides guests with unmatched mountain scenery. Floor-to-ceiling glass paneling frames the entire Annapurna range. Warm up beside the custom stone-carved wood fireplace, relax on handmade wool rugs, or enjoy the outdoor hot tub. Includes private terrace access and a separate lounge library.',
        price: 450,
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Hot Tub Terrace', 'Indoor Fireplace', 'Library Nook', 'Valet Service', 'Himalayan Bath Salts', 'Bose Sound System'],
        capacity: 2,
        bedType: 'King Grand',
        roomSize: '80 sqm',
        featured: true,
        availability: true
      },
      {
        title: 'Sanctum Sanctuary Villa',
        slug: 'sanctum-sanctuary-villa',
        shortDescription: 'Two-bedroom architectural masterpiece surrounded by bamboo groves and water paths.',
        description: 'Our flagship accommodation, the Sanctum Sanctuary Villa, is a two-story villa crafted from organic stone and rammed earth. Designed for absolute privacy, it features a private garden, a 15-meter infinity pool, private spa treatment rooms, and a fully equipped kitchen. Ideal for families or guests seeking an isolated retreat. Includes a dedicated round-the-clock chef and butler service.',
        price: 850,
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['15m Infinity Pool', '24/7 Private Chef', 'Private Spa Room', 'Wine Cellar', 'Bamboo Zen Garden', 'Premium Airport pickup'],
        capacity: 4,
        bedType: '2 King Imperial',
        roomSize: '180 sqm',
        featured: false,
        availability: true
      }
    ]);
    console.log('Seeded: Luxury Rooms');

    // 5. Create Services
    await Service.create([
      {
        title: 'Soma Healing Spa',
        description: 'Holistic Ayurvedic massage and hot stone therapies utilizing organic herbs gathered from the Annapurna foothills.',
        icon: 'bi-flower1',
        order: 1
      },
      {
        title: 'Lakeside Organic Dining',
        description: 'Vibrant farm-to-table cuisine prepared with fresh produce, wild honey, and herbs sourced from Lakeside farms.',
        icon: 'bi-egg-fried',
        order: 2
      },
      {
        title: 'Heated Infinity Pool',
        description: 'A 25-meter temperature-controlled pool reflecting the skies and mountain ridges of Pokhara.',
        icon: 'bi-water',
        order: 3
      },
      {
        title: 'Himalayan Meditation Hall',
        description: 'A silent, glass-walled structure overlooking Phewa Lake, dedicated to yoga, sound healing, and breathwork.',
        icon: 'bi-brightness-high',
        order: 4
      }
    ]);
    console.log('Seeded: Services');

    // 6. Create Experiences
    await Experience.create([
      {
        title: 'Sarangkot Sunrise Paragliding',
        description: 'Glide gently over Phewa Lake in a tandem paraglider, with the sunrise casting golden light across the Annapurna range.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Helicopter Tour to Annapurna Base Camp',
        description: 'Fly directly into the high sanctuary of Annapurna for breakfast at 4,130m, surrounded by vertical ice walls.',
        price: 950,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Bespoke Boating & Island Meditation',
        description: 'Row across the quiet morning waters of Phewa to a secluded island forest for a guided private mindfulness session.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
      }
    ]);
    console.log('Seeded: Experiences');

    // 7. Create Testimonials
    await Testimonial.create([
      {
        guestName: 'Eleanor Vance',
        country: 'United Kingdom',
        rating: 5,
        reviewText: 'An absolute masterpiece of hospitality. The design is so clean and natural, without any unnecessary noise. Waking up to see the Annapurna peaks reflected on the lake from my bed is an experience I will hold dear forever.',
        guestImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        isApproved: true
      },
      {
        guestName: 'Dr. Akira Tanaka',
        country: 'Japan',
        rating: 5,
        reviewText: 'Perfect minimalist design, exceptionally warm service, and a beautiful connection to the Pokhara landscape. The Soma spa is truly world-class.',
        guestImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        isApproved: true
      }
    ]);
    console.log('Seeded: Testimonials');

    // 8. Create Blog Articles
    await Blog.create([
      {
        title: 'The Art of Mindful Living: Finding Stillness in Pokhara',
        slug: 'the-art-of-mindful-living-finding-stillness-in-pokhara',
        summary: 'How the natural geography of Pokhara\'s water basins and snowbound mountains facilitates deep wellness.',
        content: '<h2>Stillness by the Lakeside</h2><p>Pokhara has long been recognized as the gateway to the Annapurnas, but its true calling lies in its capacity for restoration. When we sit by Phewa Lake at dawn, the wind is silent. The surface acts as a mirror, capturing the sky and the cold peaks in perfect clarity. This visual symmetry teaches us a lesson in personal reflection.</p><h3>Integrating Local Wisdom</h3><p>At Sanctum Retreat, we integrate these lessons into our daily flow. From our dawn sound bowls to the local slate pathways that connect our villas, every element is designed to keep you present. Travel should not be about checklist collection, but about deceleration. In our next issue, we will discuss Ayurvedic treatments that realign our sleep patterns.</p>',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        category: 'Wellness',
        author: 'Aria Gurung (Spa Director)',
        seoTitle: 'Mindful Travel & Wellness in Pokhara | Sanctum',
        seoDescription: 'Discover how Pokhara\'s nature supports deep mental restoration. Insights on sound healing, lake meditation, and Ayurvedic sleep therapies.',
        seoKeywords: ['Pokhara Wellness', 'Mindful Travel', 'Sound Healing Nepal', 'Sanctum Retreat'],
        isPublished: true
      },
      {
        title: 'Pokhara Architectural Digest: Building with Earth & Slate',
        slug: 'pokhara-architectural-digest-building-with-earth-and-slate',
        summary: 'A look behind our sustainable design system, blending modern boutique minimalism with traditional Gurung stonemasonry.',
        content: '<h2>Honoring the Ground</h2><p>The materials of Pokhara tell a story of alpine resilience. Our retreat buildings utilize a unique blend of rammed earth, sustainable bamboo structural beams, and hand-cut dark slate sourced from the surrounding Kaski hills. This does not just reduce our carbon footprint; it connects guests directly to the earth they walk upon.</p><h3>Bespoke Gurung Stonework</h3><p>We collaborated with veteran Gurung stonemasons who have spent generations building paths and mountain drywalls. The result is a texture that feels organic and weathered, yet is framed by premium floor-to-ceiling glass and minimalist brass fixtures. It is the juxtaposition of raw Nepalese earth and delicate luxury comfort.</p>',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        category: 'Architecture',
        author: 'Siddharth Dev (Principal Architect)',
        seoTitle: 'Sustainable Architecture in Nepal | Sanctum Retreat',
        seoDescription: 'Read about the design philosophy of Sanctum Retreat Pokhara, featuring rammed earth, local slate stonework, and minimalist green design.',
        seoKeywords: ['Luxury Architecture', 'Rammed Earth Nepal', 'Pokhara Boutique Hotel', 'Sustainable Design'],
        isPublished: true
      }
    ]);
    console.log('Seeded: Blogs');

    // 9. Seed Gallery Images
    await Gallery.create([
      { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', category: 'Pokhara Views', caption: 'Sunrise over Annapurna peaks reflecting on Phewa Lake', order: 1 },
      { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', category: 'Pokhara Views', caption: 'Wooden boats drifting in the early morning fog', order: 2 },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', category: 'Rooms', caption: 'Minimalist suite bedroom with custom slate flooring', order: 3 },
      { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', category: 'Rooms', caption: 'Heated plunge pool deck at sunset', order: 4 },
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', category: 'Exterior', caption: 'Sanctum exterior facade showcasing organic timber cladding', order: 5 },
      { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', category: 'Lobby', caption: 'Sun-drenched main reception lounge with reflecting pool', order: 6 },
      { url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80', category: 'Restaurant', caption: 'Open-air kitchen serving farm-to-table cuisine', order: 7 }
    ]);
    console.log('Seeded: Gallery images');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
