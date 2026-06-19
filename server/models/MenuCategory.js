import mongoose from 'mongoose';

const MenuCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug
MenuCategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const MenuCategory = mongoose.model('MenuCategory', MenuCategorySchema);
export default MenuCategory;
