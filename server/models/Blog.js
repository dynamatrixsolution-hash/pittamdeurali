import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    summary: {
      type: String,
      required: [true, 'Please add blog summary'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add blog thumbnail'],
    },
    category: {
      type: String,
      default: 'General',
    },
    author: {
      type: String,
      default: 'Hotel Team',
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    seoKeywords: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
