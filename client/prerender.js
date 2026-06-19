import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// Define pages with their respective meta tags and prerendered HTML skeletons
const PAGES = [
  {
    route: 'about',
    title: 'About New Pittam Deurali Guest House and Restaurant | Pittam Deurali Lodge',
    description: 'Discover the story of New Pittam Deurali Guest House and Restaurant, a family-run mountain lodge in Pittam Deurali, Lumle, offering comfortable rooms, warm hospitality, and dining for Annapurna trekkers.',
    keywords: 'About New Pittam Deurali, Pittam Deurali Guest House Story, Deurali Guest House Team, Annapurna Trek Lodge About, Trekking Accommodation Nepal, Family Guest House Nepal, Trekker Friendly Lodge, Stay in Lumle Kaski, Dhampus Lodging History, Gandaki Province Hospitality, Mountain Lodge Owners Nepal, Mardi Himal Guest House About, Local Sherpa Hospitality, Pokhara Trekking Stay History, Annapurna Conservation Area Hotel, Budget Hotel Dhampus Profile',
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About New Pittam Deurali Guest House and Restaurant",
      "description": "Story of our family-run mountain lodge and restaurant in Kaski, Nepal.",
      "url": "https://pittamdeuraliguesthouse.com/about"
    },
    body: `
      <header class="container text-center py-5">
        <h1>About New Pittam Deurali Guest House and Restaurant</h1>
        <p class="lead">A Heritage of Mountain Hospitality & Homestay comfort in Kaski, Nepal.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Our Story: Family-Operated Comfort since inception</h2>
          <p>Situated at 2,100 meters along the ridge-top of Pittam Deurali, our guest house and restaurant has served as a trusted sanctuary for trekkers, backpackers, and families visiting the Annapurna region, Mardi Himal trek, Pothana, and Dhampus.</p>
          <p>We provide comfortable lodging with warm wooden rooms, reliable hot showers, delicious local organic meals cooked on a traditional wood-fired stove, and advice for trekking trails.</p>
        </section>
      </main>
    `
  },
  {
    route: 'rooms',
    title: 'Cozy Rooms & Accommodation | New Pittam Deurali Guest House',
    description: 'Explore clean, budget-friendly rooms at New Pittam Deurali Guest House in Pittam Deurali, Lumle. Relax with hot showers, cozy beds, and beautiful Himalayan mountain views.',
    keywords: 'Pittam Deurali Guest House Rooms, Mardi Himal Accommodation, Deurali Guest House Rooms, Hotel in Pittam Deurali Rooms, Budget Hotel Dhampus, Stay in Deurali Rooms, Trekking Lodge Nepal Rooms, Best Guest House in Dhampus, Hotel near Australian Camp, Himalayan View Accommodation, Double Room Pothana, Single Room Dhampus, Trekker Friendly Lodge Rooms, Family Guest House Nepal Rooms, Pokhara Trekking Stay Rooms, Annapurna Region Hotel Rooms, Hot Shower Lodge Pothana, Kaski Nepal Rooms, Pokhara Mountain View Rooms, Backpacker Rooms Pothana',
    schema: {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "New Pittam Deurali Guest House and Restaurant Accommodation",
      "description": "Cozy mountain view rooms, family rooms, and budget accommodation in Pittam Deurali, Nepal.",
      "url": "https://pittamdeuraliguesthouse.com/rooms",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Pittam Deurali, Lumle 33700",
        "addressLocality": "Kaski",
        "addressCountry": "NP"
      }
    },
    body: `
      <header class="container text-center py-5">
        <h1>Cozy Rooms & Lodging in Pittam Deurali</h1>
        <p class="lead">Comfortable accommodations with hot water and mountain views.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Best Hotel & Homestay Rooms in Pittam Deurali & Dhampus</h2>
          <p>We offer double rooms, single accommodations, and family rooms designed for a restful stay. Our rooms are insulated with natural wood, equipped with clean blankets, pillows, and have access to hot running showers to refresh after trekking from Kande or Australian Camp.</p>
        </section>
      </main>
    `
  },
  {
    route: 'restaurant',
    title: 'Local Restaurant & Dining | New Pittam Deurali Guest House and Restaurant',
    description: 'Enjoy delicious Nepali Dal Bhat and international cuisine at New Pittam Deurali Restaurant in Pittam Deurali. Fuel up for your Mardi Himal and Annapurna trekking with organic local food.',
    keywords: 'Pittam Deurali Restaurant, Dhampus Dining, Best Dal Bhat in Pittam Deurali, Mardi Himal Trek Food, Deurali Guest House Restaurant, Annapurna Trek Lodge Food, Trekking Lodge Nepal Restaurant, Local Organic Food Kaski, Nepalese Cuisine Pothana, Breakfast in Dhampus, Trekker Friendly Lodge Dining, Mountain View Restaurant Pokhara, Stay in Pothana Food, Pokhara Trekking Stay Restaurant, Gandaki Province Traditional Food, Family Guest House Nepal Restaurant, Deurali Coffee Shop, Himalayan Organic Dining',
    schema: {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "New Pittam Deurali Restaurant",
      "description": "Authentic local organic Dal Bhat and wood-fired traditional meals in Pittam Deurali, Lumle.",
      "url": "https://pittamdeuraliguesthouse.com/restaurant",
      "servesCuisine": "Nepalese, International",
      "priceRange": "$$"
    },
    body: `
      <header class="container text-center py-5">
        <h1>New Pittam Deurali Restaurant & Traditional Dining</h1>
        <p class="lead">Best restaurant in Pittam Deurali serving fresh organic food.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Traditional Wood-Fired Nepali Dal Bhat & Dining</h2>
          <p>Savor authentic local meals cooked over our wood-fired stove for an authentic smoky taste. We grow seasonal vegetables in our organic garden, providing fresh, healthy, and energizing local dining for trekkers exploring Kaski and Gandaki Province trails.</p>
        </section>
      </main>
    `
  },
  {
    route: 'treks',
    title: 'Trekking & Activities | New Pittam Deurali Lodge',
    description: 'Explore popular treks and activities near Pittam Deurali, including Mardi Himal Trek, Australian Camp hike, and Dhampus Village walks from our Guest House.',
    keywords: 'Guest House near Mardi Himal Trek, Mardi Himal Trekking Stay, Hotel near Australian Camp, Annapurna Trek Lodge Activities, Dhampus Village Hikes, Pothana Trekking Guide, Deurali Guest House Treks, Trekking Lodge Nepal Activities, Stay in Pothana Hikes, Best Guest House in Dhampus Guided Walks, Pokhara Trekking Stay Routes, Annapurna Conservation Area Activities, Kaski Nepal Trekking Trails, Family Guest House Nepal Tours, Budget Hotel Dhampus Day Hikes, Gandaki Province Hiking Trails, Pothana to Forest Camp Trek, Landruk Trek Stay, Jhinu Hot Springs Trek, Australian Camp Day Hikes',
    schema: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Mardi Himal & Annapurna Trekking junction in Pittam Deurali",
      "description": "Trekking routes, Australian Camp hikes, and Dhampus walks originating from Pittam Deurali."
    },
    body: `
      <header class="container text-center py-5">
        <h1>Trekking & Mountain Activities in Annapurna Region</h1>
        <p class="lead">Plan your Mardi Himal Trek and day hikes from Pittam Deurali.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Mardi Himal Route & Australian Camp Junction</h2>
          <p>New Pittam Deurali Guest House and Restaurant is strategically located on the ridge where hiking trails from Dhampus, Pothana, Australian Camp, and Kande meet. It serves as a key checkpoint and resting stopover on your way to Forest Camp, High Camp, and Mardi Himal Base Camp.</p>
        </section>
      </main>
    `
  },
  {
    route: 'services',
    title: 'Our Services & Amenities | New Pittam Deurali Guest House',
    description: 'Enjoy hot showers, high-speed Wi-Fi, gear rental, luggage storage, and local trekking guides at New Pittam Deurali Guest House and Restaurant in Pittam Deurali.',
    keywords: 'Potham Guest House Services, Deurali Guest House Amenities, Hot Showers in Pothana, Wi-Fi Trekking Lodge Nepal, Luggage Storage Dhampus, Trekking Guide Service Pothana, Mardi Himal Accommodation Services, Annapurna Trek Lodge Amenities, Stay in Pothana Services, Best Guest House in Dhampus Amenities, Budget Hotel Dhampus Services, Family Guest House Nepal Amenities, Trekker Friendly Lodge Services, Pokhara Trekking Stay Amenities, Gandaki Province Lodge Services, Himalayan Lodge Wi-Fi, Hot Water Lodge Dhampus, Pothana Local Guides',
    body: `
      <header class="container text-center py-5">
        <h1>Services & Lodge Amenities for Trekkers</h1>
        <p class="lead">Luggage storage, hot showers, and high-speed Wi-Fi at 2,100m.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Trekker Comforts in Pittam Deurali</h2>
          <p>We provide all necessary services to make your journey comfortable: expert local guide arrangements, baggage storage while you trek, clean gear rentals, power charging stations, and hot running showers to recover from your trek.</p>
        </section>
      </main>
    `
  },
  {
    route: 'gallery',
    title: 'Photos & Gallery | New Pittam Deurali Guest House and Restaurant',
    description: 'Browse photos of New Pittam Deurali Guest House, Mardi Himal Trek, Dhampus Village, organic food, cozy rooms, and stunning Annapurna mountain views.',
    keywords: 'Pothana Gallery, Mardi Himal Photos, Dhampus Village Gallery, Pitam Deurali Guest House Photos, Himalayan View Gallery, Annapurna Trek Lodge Pictures, Deurali Guest House Gallery, Hotel in Pothana Photos, Hotel in Dhampus Pictures, Stay in Pothana Gallery, Australian Camp Photos, Trekking Lodge Nepal Gallery, Best Guest House in Dhampus Photos, Pokhara Trekking Stay Gallery, Kaski Nepal Scenery, Gandaki Province Trek Photos, Nepal Mountain Lodge Pictures, Annapurna Sunrise Photos',
    body: `
      <header class="container text-center py-5">
        <h1>Photo Gallery & Mountain Scenery</h1>
        <p class="lead">View images of our rooms, restaurant, and Himalayan views.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Visual Tour of New Pittam Deurali</h2>
          <p>Explore beautiful images of double and single lodging rooms, traditional clay ovens, local organic meals, and mountain viewpoints showing Machhapuchhre (Fishtail), Annapurna South, and Dhaulagiri ranges.</p>
        </section>
      </main>
    `
  },
  {
    route: 'location',
    title: 'Location & Map | New Pittam Deurali Guest House and Restaurant',
    description: 'Find detailed maps, transport guides, and directions to New Pittam Deurali Guest House and Restaurant in Pittam Deurali, Lumle. Easily accessible from Pokhara and Dhampus.',
    keywords: 'Potham Guest House Location, How to reach Pothana, Deurali Guest House Map, Hotel in Pothana Location, Hotel in Dhampus Map, Guest House near Mardi Himal Route, Hotel near Australian Camp Map, Stay in Pothana Directions, Best Guest House in Dhampus Location, Pokhara Trekking Stay Map, Annapurna Region Hotel Location, Gandaki Province Pothana Map, Kaski Nepal Trekking Hub, Family Guest House Nepal Location, Budget Hotel Dhampus Location, Deurali Nepal Travel Map, Pokhara to Dhampus Route Details',
    schema: {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": "New Pittam Deurali Guest House and Restaurant Location",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Pittam Deurali, Lumle 33700",
        "addressLocality": "Kaski",
        "addressRegion": "Gandaki Province",
        "addressCountry": "NP"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.3254375,
        "longitude": 83.8290625
      },
      "hasMap": "https://maps.app.goo.gl/nY4La8N4LUFQjN9p9"
    },
    body: `
      <header class="container text-center py-5">
        <h1>Our Location & Directions</h1>
        <p class="lead">Pittam Deurali, Lumle, Kaski, Gandaki Province, Nepal.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Map & Travel Coordinates</h2>
          <p>We are situated on the beautiful forest ridge-top trail of Pittam Deurali at coordinates: <strong>28.3254° N, 83.8291° E</strong>. You can reach us by hiking 45 minutes from Australian Camp, 2 hours from Dhampus, or 2.5 hours from Kande.</p>
        </section>
      </main>
    `
  },
  {
    route: 'contact',
    title: 'Contact New Pittam Deurali Guest House and Restaurant | Pittam Deurali Lodge',
    description: 'Get in touch with New Pittam Deurali Guest House and Restaurant in Pittam Deurali, Lumle. Find our phone numbers, email, map directions, and book your stay in Kaski, Nepal.',
    keywords: 'Contact Pitam Deurali Guest House, Pothana Guest House Contact Number, Deurali Guest House Phone, Hotel in Pothana Address, Hotel in Dhampus Map, Stay in Pothana Inquiry, Mardi Himal Accommodation Contact, Annapurna Trek Lodge Email, Best Guest House in Dhampus Contact, Booking Inquiry Pothana, Gandaki Province Lodge Phone, Kaski Nepal Hotel Contact, Family Guest House Nepal Contact, Budget Hotel Dhampus Directions, Pokhara Trekking Stay Email, Deurali Guest House Address, Pokhara to Pothana Route Help',
    body: `
      <header class="container text-center py-5">
        <h1>Contact Us for Bookings & Enquiries</h1>
        <p class="lead">Get in touch with our family booking office.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Direct Contact Numbers</h2>
          <p><strong>Mobile Phones:</strong> +977-9866061995, +977-9814157732, +977-9819163263</p>
          <p><strong>Email Address:</strong> stay@pittamdeuraliguesthouse.com</p>
          <p><strong>Physical Address:</strong> Pittam Deurali, Lumle 33700, Kaski, Gandaki Province, Nepal</p>
        </section>
      </main>
    `
  },
  {
    route: 'booking',
    title: 'Book Your Room | New Pittam Deurali Guest House and Restaurant',
    description: 'Reserve your room online at New Pittam Deurali Guest House and Restaurant in Pittam Deurali. Best rates guaranteed for Mardi Himal trekkers, couples, families, and backpackers.',
    keywords: 'Book Pitam Deurali Guest House, Pothana Guest House Reservation, Deurali Guest House Booking, Hotel in Pothana Rates, Hotel in Dhampus Booking, Stay in Pothana Online Booking, Mardi Himal Accommodation Reservation, Annapurna Trek Lodge Rates, Best Guest House in Dhampus Booking, Budget Hotel Dhampus Rates, Pokhara Trekking Stay Reservation, Himalayan View Accommodation Booking, Family Guest House Nepal Reservation, Trekker Friendly Lodge Booking, Gandaki Province Lodge Reservation, Kaski Nepal Room Booking, Online Trekking Lodge Booking, Cheap Rooms Pothana Booking',
    body: `
      <header class="container text-center py-5">
        <h1>Reserve Your Room & Meal Group Booking</h1>
        <p class="lead">Enjoy guaranteed accommodation during peak trekking seasons.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Secure Your Accommodation</h2>
          <p>Trekking during peak seasons (October-November & March-April) can be crowded. Reserve your double room, single room, or group dining package in advance to guarantee a warm bed and hearty dinner on your journey.</p>
        </section>
      </main>
    `
  },
  {
    route: 'blog',
    title: 'Trekking Blog & Guides | New Pittam Deurali Guest House',
    description: 'Read expert travel guides, trekking tips, and local stories from Pittam Deurali, Dhampus, Mardi Himal, and the beautiful Annapurna Conservation Area in Nepal.',
    keywords: 'Pothana Trekking Blog, Mardi Himal Trek Guide, Dhampus Travel Stories, Deurali Guest House Blog, Annapurna Region Travel Tips, Trekking Lodge Nepal Blog, Stay in Pothana Blog, Best Guest House in Dhampus Articles, Himalayan Trekking Packing List, Pokhara Trekking Stay Blog, Family Guest House Nepal Travel Tips, Kaski Nepal Travel Guide, Gandaki Province Trekking Stories, Budget Hotel Dhampus Blog, Annapurna Conservation Area Blog, Australian Camp Travel Guide, Winter Trekking Mardi Himal, Pothana Village Travel Tips',
    body: `
      <header class="container text-center py-5">
        <h1>Trekking Blog, Local Stories & Mountain Guides</h1>
        <p class="lead">Inside stories, pack guides, and itineraries for Mardi Himal.</p>
      </header>
      <main class="container">
        <section class="my-4">
          <h2>Latest Travel Guides & Trail Logs</h2>
          <p>Read about winter treks, altitude safety guidelines, packing checklists, routes from Australian Camp to Landruk, and historical stories of the Gandaki Province, Kaski, Nepal.</p>
        </section>
      </main>
    `
  }
];

const prerender = () => {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Error: Skeleton build file not found at: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  console.log(`Starting prerendering for ${PAGES.length} routes...`);

  PAGES.forEach((page) => {
    const routeDir = path.join(DIST_DIR, page.route);
    
    // Ensure path exists
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    let prerenderedHtml = templateHtml;

    // 1. Swap title
    if (page.title) {
      prerenderedHtml = prerenderedHtml.replace(
        /<title>.*?<\/title>/i,
        `<title>${page.title}</title>`
      );
    }

    // 2. Swap metadata
    if (page.description) {
      prerenderedHtml = prerenderedHtml.replace(
        /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="description" content="${page.description}" />`
      );
    }

    if (page.keywords) {
      prerenderedHtml = prerenderedHtml.replace(
        /<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="keywords" content="${page.keywords}" />`
      );
    }

    // 3. Inject Structured Schema Script
    if (page.schema) {
      const schemaScript = `\n    <script type="application/ld+json">\n      ${JSON.stringify(page.schema, null, 2)}\n    </script>\n  </head>`;
      prerenderedHtml = prerenderedHtml.replace(/<\/head>/i, schemaScript);
    }

    // 4. Inject prerendered body inside <div id="root"></div>
    if (page.body) {
      const cleanBody = page.body.trim();
      prerenderedHtml = prerenderedHtml.replace(
        /<div\s+id=["']root["']>\s*<\/div>/i,
        `<div id="root">\n      ${cleanBody}\n    </div>`
      );
    }

    // Write file
    const targetFile = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetFile, prerenderedHtml, 'utf8');
    console.log(`✓ Prerendered route: /${page.route} -> dist/${page.route}/index.html`);
  });

  console.log('Static prerendering complete successfully!');
};

prerender();
