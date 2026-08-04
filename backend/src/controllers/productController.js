const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters, search, sort, pagination
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      subcategory,
      minPrice,
      maxPrice,
      minRating,
      discount,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = {};

    // Search by keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by category (accepts either a category ObjectId or a category name/slug)
    if (category) {
      // If it's a valid ObjectId, use it directly
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Otherwise resolve the category name/slug to its ObjectId
        const cat = await Category.findOne({
          $or: [{ name: category }, { slug: category }],
        });
        if (cat) {
          query.category = cat._id;
        } else {
          return res.status(404).json({
            success: false,
            message: 'Category not found',
          });
        }
      }
    }

    // Filter by brand (case-insensitive)
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    }

    // Filter by subcategory (matched against tags)
    if (subcategory) {
      query.tags = { $in: [subcategory.toLowerCase()] };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Filter by minimum discount percentage
    if (discount) {
      query.discountPercentage = { $gte: Number(discount) };
    }

    // Featured products
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sort options
    let sortQuery = {};
    switch (sort) {
      case 'price_asc':
        sortQuery = { price: 1 };
        break;
      case 'price_desc':
        sortQuery = { price: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'popular':
        sortQuery = { sold: -1 };
        break;
      case 'rating':
        sortQuery = { rating: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct brands and subcategories (tags) for a category
// @route   GET /api/products/filters
exports.getProductFilters = async (req, res, next) => {
  try {
    const { category } = req.query;

    let categoryId = null;
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryId = category;
      } else {
        const cat = await Category.findOne({
          $or: [{ name: category }, { slug: category }],
        });
        if (cat) {
          categoryId = cat._id;
        } else {
          return res.status(404).json({
            success: false,
            message: 'Category not found',
          });
        }
      }
    }

    const match = categoryId ? { category: categoryId } : {};

    const [brands, subcategories] = await Promise.all([
      Product.distinct('brand', match),
      Product.distinct('tags', match),
    ]);

    // Sort brands alphabetically, case-insensitive
    const sortedBrands = brands
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    // Subcategories come from tags — filter out any generic tags that aren't useful
    const genericTags = new Set([
      'new', 'sale', 'featured', 'trending', 'best', 'best-seller', 'bestseller',
      'premium', 'budget', 'top', 'popular', 'hot', 'exclusive', 'latest',
    ]);
    const sortedSubcategories = subcategories
      .filter((t) => t && !genericTags.has(t.toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    res.json({
      success: true,
      brands: sortedBrands,
      subcategories: sortedSubcategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category', 'name slug');
    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ success: true, message: 'Review added', product });
  } catch (error) {
    next(error);
  }
};
