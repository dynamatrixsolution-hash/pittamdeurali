import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';
import fs from 'fs';
import path from 'path';

// --- Category Controllers ---

// @desc    Get all categories
// @route   GET /api/menu-categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await MenuCategory.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a category
// @route   POST /api/menu-categories
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a category name' });
    }
    const category = await MenuCategory.create({ name });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name must be unique' });
    }
    next(err);
  }
};

// @desc    Update a category
// @route   PUT /api/menu-categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    let category = await MenuCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = name || category.name;
    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a category
// @route   DELETE /api/menu-categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await MenuCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};


// --- Menu Item Controllers ---

// @desc    Get all menu items
// @route   GET /api/menu-items
export const getMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a menu item
// @route   POST /api/menu-items
export const createMenuItem = async (req, res, next) => {
  try {
    const { 
      name, 
      category, 
      description, 
      price, 
      discountPrice, 
      popularBadge, 
      availabilityStatus, 
      showPriceToggle 
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const item = await MenuItem.create({
      name,
      category,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      popularBadge: popularBadge === 'true' || popularBadge === true,
      availabilityStatus: availabilityStatus === 'true' || availabilityStatus === true,
      showPriceToggle: showPriceToggle === 'true' || showPriceToggle === true,
      image: imageUrl
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    // Cleanup uploaded file if creation fails
    if (req.file) {
      const filePath = path.resolve(`public/uploads/${req.file.filename}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(err);
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu-items/:id
export const updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const { 
      name, 
      category, 
      description, 
      price, 
      discountPrice, 
      popularBadge, 
      availabilityStatus, 
      showPriceToggle 
    } = req.body;

    item.name = name || item.name;
    item.category = category || item.category;
    item.description = description !== undefined ? description : item.description;
    item.price = price !== undefined ? Number(price) : item.price;
    item.discountPrice = discountPrice !== undefined ? (discountPrice ? Number(discountPrice) : null) : item.discountPrice;
    
    if (popularBadge !== undefined) {
      item.popularBadge = popularBadge === 'true' || popularBadge === true;
    }
    if (availabilityStatus !== undefined) {
      item.availabilityStatus = availabilityStatus === 'true' || availabilityStatus === true;
    }
    if (showPriceToggle !== undefined) {
      item.showPriceToggle = showPriceToggle === 'true' || showPriceToggle === true;
    }

    if (req.file) {
      // Delete old image if it exists and is local
      if (item.image && item.image.startsWith('/uploads/')) {
        const oldPath = path.resolve(`public${item.image}`);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      item.image = `/uploads/${req.file.filename}`;
    }

    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    if (req.file) {
      const filePath = path.resolve(`public/uploads/${req.file.filename}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(err);
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu-items/:id
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Delete image if it exists
    if (item.image && item.image.startsWith('/uploads/')) {
      const imgPath = path.resolve(`public${item.image}`);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
};
