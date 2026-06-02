import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Room from './models/Room.js';
import Gallery from './models/Gallery.js';
import Service from './models/Service.js';
import Restaurant from './models/Restaurant.js';
import Review from './models/Review.js';
import Blog from './models/Blog.js';
import Settings from './models/Settings.js';
import HomepageCms from './models/HomepageCms.js';
import MenuCategory from './models/MenuCategory.js';
import MenuItem from './models/MenuItem.js';
import Trek from './models/Trek.js';
import Hero from './models/Hero.js';
import AboutUs from './models/AboutUs.js';
import Family from './models/Family.js';

dotenv.config();

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is required');
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Room.deleteMany({});
    await Gallery.deleteMany({});
    await Service.deleteMany({});
    await Restaurant.deleteMany({});
    await Review.deleteMany({});
    await Blog.deleteMany({});
    await Settings.deleteMany({});
    await HomepageCms.deleteMany({});
    await MenuCategory.deleteMany({});
    await MenuItem.deleteMany({});
    await Trek.deleteMany({});
    await Hero.deleteMany({});
    await AboutUs.deleteMany({});
    await Family.deleteMany({});
    console.log('Cleaned database collections.');

    // 1. Create Default Admin
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@newpittamdeurali.com',
      name: 'Pittam Deurali Manager',
    });
    console.log('Seeded: Admin user (admin / admin123)');

    // 2. Create Global Settings
    await Settings.create({
      hotelName: 'New Pittam Deurali Guest House & Restaurant',
      address: 'Pittam Deurali, Lumle 33700, Kaski, Nepal',
      phone: '+977-9801234567',
      email: 'stay@newpittamdeurali.com',
      whatsappNumber: '9779801234567',
      googleMapIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.522204907997!2d83.82256137530612!3d28.330925975829672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995ebdc4ec5418b%3A0xe54e60ef2b1c6096!2sPitam%20Deurali!5e0!3m2!1sen!2snp!4v1717200000000!5m2!1sen!2snp',
      facebookUrl: 'https://facebook.com/newpittamdeurali',
      instagramUrl: 'https://instagram.com/newpittamdeurali',
      tripAdvisorUrl: 'https://tripadvisor.com',
      showPricesPublicly: true,
      enableDiscounts: true,
      highlightDiscountedItems: true,
      showContactForPriceInstead: false
    });
    console.log('Seeded: Settings');

    // 3. Create Homepage CMS Text Content
    await HomepageCms.create({
      hero: {
        title: 'Experience Comfortable Hospitality at New Pittam Deurali Guest House & Restaurant',
        subtitle: 'Enjoy comfortable accommodation, delicious local cuisine, and beautiful surroundings with genuine Nepali hospitality.',
        image: '/uploads/image.png',
        buttonText: 'Reserve Your Stay',
        buttonLink: '/rooms',
      },
      heroSlides: [
        {
          title: 'Welcome to New Pittam Deurali',
          subtitle: 'Experience warm wooden lodging, hot showers, and friendly hospitality in Kaski.',
          image: '/uploads/image.png',
          buttonText: 'Explore Rooms',
          buttonLink: '/rooms',
          order: 0,
          active: true
        },
        {
          title: 'Traditional Wood-fired Kitchen',
          subtitle: 'Savor organic local Dal Bhat, handmade dumplings, and fresh mountain teas.',
          image: '/uploads/image copy 6.png',
          buttonText: 'View Food Menu',
          buttonLink: '/restaurant',
          order: 1,
          active: true
        },
        {
          title: 'Breathtaking Himalayan Vistas',
          subtitle: 'Wake up to direct sunrise views of the majestic Annapurna and Dhaulagiri ranges.',
          image: '/uploads/image copy 8.png',
          buttonText: 'View Gallery',
          buttonLink: '/gallery',
          order: 2,
          active: true
        }
      ],
      welcome: {
        title: 'Welcome to New Pittam Deurali',
        subtitle: 'Authentic Nepali Hospitality & Cozy Mountain Lodging',
        description: 'Nestled in the beautiful ridge-top village of Pitam Deurali, our family-run guest house and restaurant serves as a warm, welcoming stopover for trekkers, families, and tourists. Enjoy our comfortable rooms, authentic homemade Nepali meals, and breathtaking views of the Annapurna and Dhaulagiri mountain ranges. We take pride in sharing our local culture, fresh organic ingredients, and friendly atmosphere with every traveler.',
        image: '/uploads/image copy.png',
      },
      roomsSection: {
        title: 'Cozy Rooms & Lodging',
        subtitle: 'Warm wooden rooms with hot showers, comfortable beds, and stunning mountain views.'
      },
      servicesSection: {
        title: 'Guest Amenities',
        subtitle: 'Simple, convenient, and traditional amenities to make your trekking stopover comfortable.'
      },
      testimonialsSection: {
        title: 'Traveler Journals',
        subtitle: 'Real reviews and warm stories shared by hikers and travelers from across the globe.'
      },
      gallerySection: {
        title: 'Guest House Gallery',
        subtitle: 'Explore our guest rooms, restaurant dining, organic garden, and scenic forest trails.'
      },
      faqs: [
        {
          question: 'How do we reach Pittam Deurali from Pokhara?',
          answer: 'You can take a scenic drive from Pokhara to Kande (approx. 45 minutes) and then enjoy a beautiful trek of about 2 to 2.5 hours through rhododendron and oak forests to reach our guest house at the ridge.'
        },
        {
          question: 'Do you serve traditional local cuisine?',
          answer: 'Yes! We serve authentic wood-fire Nepali Dal Bhat, local organic vegetables, handmade momos, and traditional spices, prepared fresh daily by our family.'
        },
        {
          question: 'Is hot water and Wi-Fi available at the guest house?',
          answer: 'Yes, we provide hot solar/gas showers and high-speed Wi-Fi to all our guests so you can relax and stay connected after a long day of hiking.'
        }
      ]
    });
    console.log('Seeded: Homepage CMS details');

    // 4. Create Rooms
    await Room.create([
      {
        title: 'Standard Double Room',
        slug: 'standard-double-room',
        shortDescription: 'Cozy double bedroom featuring clean linens, hot water, and a mountain view window.',
        description: 'Our Standard Double Room is perfect for couples or solo trekkers looking for a comfortable rest. Features a double bed, clean sheets, blankets, attached bathroom with a hot shower, and windows opening directly to forest and mountain views.',
        price: 25,
        images: [
          '/uploads/image copy 2.png',
          '/uploads/image copy 3.png'
        ],
        amenities: ['Attached Bathroom', 'Hot Water Shower', 'High-Speed Wi-Fi', 'Clean Towels', 'Electric Blankets', 'Charging Outlets'],
        capacity: 2,
        bedType: '1 Double Bed',
        roomSize: '16 sqm',
        featured: true,
        availability: true
      },
      {
        title: 'Mountain View Family Room',
        slug: 'mountain-view-family-room',
        shortDescription: 'Spacious family room with two double beds, panoramic mountain views, and local timber decor.',
        description: 'Designed for families or groups traveling together, this spacious room features two double beds, warm local timber paneling, thick wool blankets, and an attached bathroom. Wake up to direct sunrise views of the Annapurna range.',
        price: 45,
        images: [
          '/uploads/image copy 4.png',
          '/uploads/image copy 5.png'
        ],
        amenities: ['Two Double Beds', 'Attached Bathroom', 'Hot Water Shower', 'High-Speed Wi-Fi', 'Scenic Balcony', 'Charging Outlets', 'Sitting Area'],
        capacity: 4,
        bedType: '2 Double Beds',
        roomSize: '28 sqm',
        featured: true,
        availability: true
      },
      {
        title: 'Shared Hiker Cabin',
        slug: 'shared-hiker-cabin',
        shortDescription: 'A cozy wood-paneled room with three single beds, perfect for trekking groups.',
        description: 'Our Shared Hiker Cabin is a classic trekking lodge room with three single beds. Features comfortable mattresses, extra warm quilts, and access to hot shower facilities. Ideal for budget-conscious hikers traveling in groups.',
        price: 15,
        images: [
          '/uploads/image copy 2.png',
          '/uploads/image copy 4.png'
        ],
        amenities: ['3 Single Beds', 'Hot Showers', 'High-Speed Wi-Fi', 'Charging Outlets', 'Scenic Forest View'],
        capacity: 3,
        bedType: '3 Single Beds',
        roomSize: '20 sqm',
        featured: false,
        availability: true
      }
    ]);
    console.log('Seeded: Rooms');

    // 5. Create Services
    await Service.create([
      {
        title: 'Authentic Nepali Kitchen',
        description: 'Delicious farm-to-table Nepali cuisine, traditional Dal Bhat, local vegetables, and hot organic tea.',
        icon: 'bi-egg-fried',
        order: 1
      },
      {
        title: 'Hot Water & Showers',
        description: 'Reliable gas and solar heating systems providing hot water showers for cold mountain evenings.',
        icon: 'bi-water',
        order: 2
      },
      {
        title: 'High-Speed Wi-Fi & Charging',
        description: 'Stay connected with your family and charge all your cameras and phones in our dining hall.',
        icon: 'bi-lightning-charge',
        order: 3
      },
      {
        title: 'Trekking & Guide Assistance',
        description: 'Get local advice, route maps, and hire certified local guides/porters for Mardi Himal and ABC treks.',
        icon: 'bi-compass',
        order: 4
      }
    ]);
    console.log('Seeded: Services');

    // 6. Seed Restaurant CMS Information
    await Restaurant.create({
      title: 'Traditional Nepali Dining Experience',
      subtitle: 'Wood-fired organic meals on the Annapurna trails',
      description: 'At New Pittam Deurali Guest House & Restaurant, dining is at the heart of our hospitality. Our family kitchen prepares every meal over a traditional wood-fired stove, imparting a rich, authentic smoky flavor to local dishes. We serve wholesome, fresh meals designed to re-energize trekkers who have walked the forest trails from Kande or are continuing to Mardi Himal.',
      features: ['Fresh Local Ingredients', 'Traditional Nepali Cuisine', 'Family Dining', 'Vegetarian Options'],
      coverImage: '/uploads/image copy 6.png',
      galleryImages: [
        '/uploads/image copy 6.png',
        '/uploads/image copy 7.png',
        '/uploads/image.png'
      ]
    });
    console.log('Seeded: Restaurant CMS Details');

    // 6.5. Create Restaurant Menu Categories & Items (CMS)
    await MenuCategory.create([
      { name: 'Local Specials' },
      { name: 'Dal Bhat & Rice' },
      { name: 'Dumplings & Momos' },
      { name: 'Traditional Snacks' },
      { name: 'Beverages' }
    ]);
    console.log('Seeded: Menu Categories');

    await MenuItem.create([
      {
        name: 'Deurali Special Dal Bhat',
        category: 'dal-bhat-rice',
        description: 'Fresh local organic seasonal greens, woodfire cooked black lentils, organic rice, mountain pickles.',
        price: 500,
        discountPrice: 450,
        popularBadge: true,
        availabilityStatus: true,
        showPriceToggle: true,
        image: '/uploads/image copy 7.png'
      },
      {
        name: 'Local Kukhura ko Momo',
        category: 'dumplings-momos',
        description: 'Steamed or pan-fried organic free-range local chicken dumplings, served with roasted tomato and sesame chutney.',
        price: 350,
        discountPrice: 300,
        popularBadge: true,
        availabilityStatus: true,
        showPriceToggle: true,
        image: '/uploads/image copy 6.png'
      },
      {
        name: 'Veg Mo:Mo',
        category: 'dumplings-momos',
        description: 'Locally grown cabbage, carrots, spring onions mixed with Himalayan herbs.',
        price: 250,
        discountPrice: 200,
        popularBadge: false,
        availabilityStatus: true,
        showPriceToggle: true,
        image: '/uploads/image copy 6.png'
      },
      {
        name: 'Traditional Sel Roti with Alloo Dum',
        category: 'traditional-snacks',
        description: 'Crispy ring-shaped rice bread served with spicy local mountain potato curry.',
        price: 200,
        discountPrice: null,
        popularBadge: true,
        availabilityStatus: true,
        showPriceToggle: true,
        image: '/uploads/image copy.png'
      },
      {
        name: 'Hot Lemon Ginger Honey Tea',
        category: 'beverages',
        description: 'Organic ginger boiled with wild forest honey and squeezed local lemon.',
        price: 120,
        discountPrice: 100,
        popularBadge: false,
        availabilityStatus: true,
        showPriceToggle: true,
        image: '/uploads/image copy 8.png'
      },
      {
        name: 'Gurung Bread with Jam',
        category: 'traditional-snacks',
        description: 'Deep-fried local flatbread, crisp and puffy, served with homemade wild berry jam.',
        price: 180,
        discountPrice: null,
        popularBadge: false,
        availabilityStatus: true,
        showPriceToggle: true,
        image: '/uploads/image.png'
      }
    ]);
    console.log('Seeded: Menu Items');

    // 7. Seed Guest Reviews
    await Review.create([
      {
        guestName: 'Sarah Jenkins',
        country: 'Australia',
        rating: 5,
        review: 'Such a warm and welcoming family! After a tiring climb from Kande, arriving here was like finding a second home. The rooms are clean and cozy, the Dal Bhat was the best I had in Nepal, and the view is spectacular!',
        image: '/uploads/image copy 5.png',
        status: 'Approved'
      },
      {
        guestName: 'Markus Weber',
        country: 'Germany',
        rating: 5,
        review: 'Perfect trekking lodge. Hot showers actually work, Wi-Fi is fast enough to call home, and the host family is incredibly friendly. I highly recommend staying here on your way to Mardi Himal!',
        image: '/uploads/image copy 7.png',
        status: 'Approved'
      }
    ]);
    console.log('Seeded: Reviews');

    // 8. Create Blog Articles
    await Blog.create([
      {
        title: 'Mardi Himal Trekking: Why Pitam Deurali is the Perfect First Stop',
        slug: 'mardi-himal-trekking-why-pitam-deurali-is-perfect-first-stop',
        summary: 'A comprehensive guide to starting your Mardi Himal adventure, focusing on the scenic trek from Kande to Pitam Deurali.',
        content: '<h2>The Beginning of the Journey</h2><p>Trekking in the Annapurna region is a life-changing experience. One of the most popular newer routes is the Mardi Himal trek. Most trekkers begin their journey in Pokhara, driving to Kande, and starting their walk from there. The first day of trekking leads through beautiful terraced fields and thick rhododendron forests to the ridge-top village of Pitam Deurali.</p><h3>Why Stay in Pitam Deurali?</h3><p>At 2,100 meters, Pitam Deurali offers a comfortable elevation to start your acclimatization. Staying at New Pittam Deurali Guest House ensures a warm, family-operated atmosphere, clean sheets, and hot water showers to soothe your muscles. In this guide, we discuss what to pack and how to pace yourself for the climb ahead.</p>',
        thumbnail: '/uploads/image.png',
        category: 'Trekking',
        author: 'Devendra (Guest House Host)',
        seoTitle: 'Mardi Himal Trek First Stop: Pitam Deurali | Guide',
        seoDescription: 'Planning your Mardi Himal trek? Discover why stopping at Pitam Deurali on your first night is the best choice for rest, food, and views.',
        seoKeywords: ['Mardi Himal Trek', 'Pitam Deurali', 'Nepal Trekking Lodge', 'Annapurna Guest House'],
        isPublished: true
      },
      {
        title: 'The Secret to the Perfect Nepalese Dal Bhat',
        slug: 'secret-to-perfect-nepalese-dal-bhat',
        summary: 'How we prepare our signature farm-to-table lentil soup and curry on a traditional wood fire at New Pittam Deurali.',
        content: '<h2>More Than Just Food: It\'s Fuel</h2><p>In Nepal, there is a saying: "Dal Bhat Power, 24 Hour." For trekkers walking hours every day, Dal Bhat is the ultimate fuel. It is a balanced meal consisting of steamed rice (Bhat), lentil soup (Dal), seasonal vegetable curry, spinach (Saag), and spicy pickle (Achar).</p><h3>Locally Sourced, Family Cooked</h3><p>At New Pittam Deurali Guest House & Restaurant, we prepare our Dal Bhat using organic vegetables harvested straight from our garden and local cooperatives. Cooking over a wood fire gives it a unique smoky flavor that you won\'t find in city restaurants. Learn about our traditional spices in this recipe post.</p>',
        thumbnail: '/uploads/image copy 6.png',
        category: 'Cuisine',
        author: 'Maya (Head Chef & Host)',
        seoTitle: 'Authentic Nepalese Dal Bhat Recipe & Story | Pitam Deurali',
        seoDescription: 'Discover the secrets of traditional Nepali Dal Bhat prepared with fresh organic ingredients at New Pittam Deurali Guest House & Restaurant.',
        seoKeywords: ['Nepali Dal Bhat', 'Traditional Nepali Food', 'Pitam Deurali Restaurant', 'Organic Cuisine Nepal'],
        isPublished: true
      }
    ]);
    console.log('Seeded: Blogs');

    // 9. Seed Gallery Images
    await Gallery.create([
      { url: '/uploads/image.png', category: 'Guest House', caption: 'New Pittam Deurali Guest House facade', order: 1 },
      { url: '/uploads/image copy.png', category: 'Surroundings', caption: 'Lush green ridge surroundings and trails', order: 2 },
      { url: '/uploads/image copy 2.png', category: 'Rooms', caption: 'Cozy standard double bedroom', order: 3 },
      { url: '/uploads/image copy 3.png', category: 'Rooms', caption: 'Comfortable beds and clean linens', order: 4 },
      { url: '/uploads/image copy 4.png', category: 'Rooms', caption: 'Spacious wood-paneled family room', order: 5 },
      { url: '/uploads/image copy 5.png', category: 'Facilities', caption: 'Clean attached bathrooms with hot showers', order: 6 },
      { url: '/uploads/image copy 6.png', category: 'Restaurant', caption: 'Dining area serving fresh local cuisine', order: 7 },
      { url: '/uploads/image copy 7.png', category: 'Restaurant', caption: 'Traditional Nepali Dal Bhat and local dishes', order: 8 },
      { url: '/uploads/image copy 8.png', category: 'Surroundings', caption: 'Breathtaking morning view of the Annapurna peaks', order: 9 }
    ]);
    console.log('Seeded: Gallery images');

    // 10. Seed Popular Treks
    await Trek.create([
      {
        name: 'Annapurna Base Camp Trek',
        image: '/uploads/image.png',
        difficulty: 'Hard',
        duration: '10 Days',
        description: 'A legendary trek reaching the base camp of the majestic Annapurna I (8,091m). Experience rhododendron forests, Gurung villages, and a high-altitude sanctuary surrounded by giant peaks.'
      },
      {
        name: 'Mardi Himal Trek',
        image: '/uploads/image copy 8.png',
        difficulty: 'Moderate',
        duration: '5-6 Days',
        description: 'A hidden gem trek starting near Kande. Climb through pristine mossy forests to High Camp and the Mardi Himal Viewpoint (4,500m) for face-to-face views of Machapuchare (Fishtail).'
      },
      {
        name: 'Poon Hill Trek',
        image: '/uploads/image copy.png',
        difficulty: 'Easy',
        duration: '3-4 Days',
        description: 'The ultimate sunrise trek in Kaski. Climb to Poon Hill (3,210m) at dawn to see the Dhaulagiri and Annapurna ranges catch the first golden rays of sun.'
      },
      {
        name: 'Ghorepani Trek',
        image: '/uploads/image copy 2.png',
        difficulty: 'Moderate',
        duration: '4 Days',
        description: 'Enjoy hiking through dense rhododendron groves, stone staircase pathways, and warm mountain village lodging. Includes a viewpoint hike to Poon Hill.'
      },
      {
        name: 'Australian Camp Trek',
        image: '/uploads/image copy 4.png',
        difficulty: 'Easy',
        duration: '2 Days',
        description: 'A gentle, family-friendly hike starting from Kande. Australian Camp offers flat grassy lawns and direct panoramic views of the entire Annapurna range, perfect for short weekend stays.'
      }
    ]);
    // 12. Create Hero Slides
    await Hero.create([
      {
        title: 'Welcome to New Pittam Deurali',
        subtitle: 'Experience warm wooden lodging, hot showers, and friendly hospitality in Kaski.',
        imageUrl: '/uploads/image.png',
        buttonText: 'Explore Rooms',
        buttonLink: '/rooms',
        order: 0,
        active: true
      },
      {
        title: 'Traditional Wood-fired Kitchen',
        subtitle: 'Savor organic local Dal Bhat, handmade dumplings, and fresh mountain teas.',
        imageUrl: '/uploads/image copy 6.png',
        buttonText: 'View Food Menu',
        buttonLink: '/restaurant',
        order: 1,
        active: true
      },
      {
        title: 'Breathtaking Himalayan Vistas',
        subtitle: 'Wake up to direct sunrise views of the majestic Annapurna and Dhaulagiri ranges.',
        imageUrl: '/uploads/image copy 8.png',
        buttonText: 'View Gallery',
        buttonLink: '/gallery',
        order: 2,
        active: true
      }
    ]);
    console.log('Seeded: Hero slides');

    // 13. Seed About Us and Family
    await AboutUs.create({
      title: 'Our Family & Hospitality',
      subtitle: 'About Us',
      description: 'New Pittam Deurali Guest House & Restaurant was established as a welcoming stopover to share authentic Nepali hospitality, home-cooked food, and comfortable lodging with travelers from around the world.',
      image: '/uploads/image copy 8.png',
      storyTitle: 'A Heritage of Mountain Hospitality',
      storyDescription: 'Situated at 2,100 meters along the ridge-top of Pitam Deurali, our guest house has served as a trusted sanctuary for trekkers embarking on the Mardi Himal and Annapurna Base Camp routes. Managed as a family-run business, we focus on creating a cozy, warm, and inviting atmosphere where travelers can rest, refuel, and connect.',
      storyImage: '/uploads/image.png'
    });

    await Family.create([
      {
        name: 'Devendra',
        role: 'Guest House Host & Trekking Coordinator',
        description: 'Devendra has been guiding Mardi Himal and ABC trekkers for over a decade. He coordinates lodge operations and routes.',
        image: '/uploads/image copy 5.png',
        order: 0
      },
      {
        name: 'Maya',
        role: 'Head Kitchen Chef',
        description: 'Maya prepares our signature wood-fire local Dal Bhat, free-range local chicken momos, and traditional Sel Roti.',
        image: '/uploads/image copy 7.png',
        order: 1
      }
    ]);
    console.log('Seeded: About Us & Family');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
