import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    buttonText: { type: String, default: 'Explore' },
    buttonLink: { type: String, default: '/rooms' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

const Hero = mongoose.model('Hero', HeroSchema);
export default Hero;
