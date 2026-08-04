const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.create({ name, description, image });
    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
