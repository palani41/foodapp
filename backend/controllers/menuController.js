import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';
import fs from 'fs';
import path from 'path';

// --- CATEGORY CONTROLLERS ---

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let image = '';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const category = await Category.create({
      name,
      description,
      image
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Optional: delete associated file from storage
    if (category.image && category.image.startsWith('/uploads/')) {
      const filepath = path.join(process.cwd(), category.image);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};

// --- MENU ITEM CONTROLLERS ---

// @desc    Get all menu items / Search / Filter
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, isVeg, minPrice, maxPrice, isAvailable } = req.query;

    const query = {};

    // Filter by category name
    if (category) {
      const catDoc = await Category.findOne({ name: { $regex: new RegExp('^' + category + '$', 'i') } });
      if (catDoc) {
        query.category = catDoc._id;
      } else {
        // If category query doesn't exist, return empty array immediately
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Veg/Non-Veg filter
    if (isVeg !== undefined) {
      query.isVeg = isVeg === 'true';
    }

    // Availability filter
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const items = await MenuItem.find(query).populate('category', 'name');
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name');
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, isVeg, isAvailable, ingredients, allergens, tags } = req.body;
    let image = '';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Category should be valid ObjectId
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      res.status(400);
      throw new Error('Invalid category ID');
    }

    const item = await MenuItem.create({
      name,
      description,
      price: Number(price),
      category,
      image,
      isVeg: isVeg === 'true' || isVeg === true,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      ingredients: ingredients ? (typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients) : [],
      allergens: allergens ? (typeof allergens === 'string' ? JSON.parse(allergens) : allergens) : [],
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : []
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    const { name, description, price, category, isVeg, isAvailable, ingredients, allergens, tags } = req.body;

    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        res.status(400);
        throw new Error('Invalid category ID');
      }
      item.category = category;
    }

    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = Number(price);
    if (isVeg !== undefined) item.isVeg = isVeg === 'true' || isVeg === true;
    if (isAvailable !== undefined) item.isAvailable = isAvailable === 'true' || isAvailable === true;
    
    if (ingredients) {
      item.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    }
    if (allergens) {
      item.allergens = typeof allergens === 'string' ? JSON.parse(allergens) : allergens;
    }
    if (tags) {
      item.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    if (req.file) {
      // delete old image if any
      if (item.image && item.image.startsWith('/uploads/')) {
        const filepath = path.join(process.cwd(), item.image);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }
      item.image = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await item.save();
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    if (item.image && item.image.startsWith('/uploads/')) {
      const filepath = path.join(process.cwd(), item.image);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item removed successfully' });
  } catch (error) {
    next(error);
  }
};
