import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food item name'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify category slug or name'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please specify food item price'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: null,
      min: [0, 'Discount price cannot be negative'],
    },
    popularBadge: {
      type: Boolean,
      default: false,
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    showPriceToggle: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
export default MenuItem;
