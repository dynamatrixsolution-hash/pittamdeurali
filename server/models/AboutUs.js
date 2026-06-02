import mongoose from 'mongoose';

const AboutUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Our Family & Hospitality'
    },
    subtitle: {
      type: String,
      default: 'About Us'
    },
    description: {
      type: String,
      default: 'New Pittam Deurali Guest House & Restaurant was established as a welcoming stopover to share authentic Nepali hospitality, home-cooked food, and comfortable lodging with travelers from around the world.'
    },
    image: {
      type: String,
      default: ''
    },
    storyTitle: {
      type: String,
      default: 'A Heritage of Mountain Hospitality'
    },
    storyDescription: {
      type: String,
      default: 'Situated at 2,100 meters along the ridge-top of Pitam Deurali, our guest house has served as a trusted sanctuary for trekkers embarking on the Mardi Himal and Annapurna Base Camp routes. Managed as a family-run business, we focus on creating a cozy, warm, and inviting atmosphere where travelers can rest, refuel, and connect.'
    },
    storyImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const AboutUs = mongoose.model('AboutUs', AboutUsSchema);
export default AboutUs;
