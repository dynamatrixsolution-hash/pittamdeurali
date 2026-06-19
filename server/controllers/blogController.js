import Blog from '../models/Blog.js';
import { handleImageUpload } from '../middleware/upload.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const { category, publishedOnly } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (publishedOnly === 'true') filter.isPublished = true;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog article
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const { title, content, summary, category, author, seoTitle, seoDescription, seoKeywords, isPublished } = req.body;

    if (!title || !content || !summary) {
      return res.status(400).json({ success: false, message: 'Title, summary, and content are required' });
    }

    let thumbnailUrl = '';
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) thumbnailUrl = uploadResult.url;
    } else {
      thumbnailUrl = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
    }

    // Process keywords
    let parsedKeywords = [];
    if (seoKeywords) {
      try {
        parsedKeywords = Array.isArray(seoKeywords) ? seoKeywords : JSON.parse(seoKeywords);
      } catch (err) {
        parsedKeywords = seoKeywords.split(',').map(k => k.trim());
      }
    }

    const slug = slugify(title) + '-' + Math.floor(Math.random() * 1000);

    const blog = await Blog.create({
      title,
      slug,
      content,
      summary,
      category: category || 'Travel',
      author: author || 'Hotel Team',
      thumbnail: thumbnailUrl,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary,
      seoKeywords: parsedKeywords,
      isPublished: isPublished === 'true' || isPublished === true,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog article
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const { title, content, summary, category, author, seoTitle, seoDescription, seoKeywords, isPublished } = req.body;

    let thumbnailUrl = blog.thumbnail;
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (uploadResult) thumbnailUrl = uploadResult.url;
    }

    // Process keywords
    let parsedKeywords = seoKeywords;
    if (seoKeywords && typeof seoKeywords === 'string') {
      try {
        parsedKeywords = JSON.parse(seoKeywords);
      } catch (err) {
        parsedKeywords = seoKeywords.split(',').map(k => k.trim());
      }
    }

    if (title) {
      blog.title = title;
      blog.slug = slugify(title) + '-' + blog._id.toString().slice(-4);
    }
    if (content) blog.content = content;
    if (summary) blog.summary = summary;
    if (category) blog.category = category;
    if (author) blog.author = author;
    if (seoTitle) blog.seoTitle = seoTitle;
    if (seoDescription) blog.seoDescription = seoDescription;
    if (parsedKeywords !== undefined) blog.seoKeywords = parsedKeywords;
    if (isPublished !== undefined) blog.isPublished = isPublished === 'true' || isPublished === true;
    blog.thumbnail = thumbnailUrl;

    const updated = await blog.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog article
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
