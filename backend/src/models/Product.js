const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: '' },
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    // SKU – unique identifier for each product
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    // Discount percentage (derived from originalPrice & price)
    discountPercentage: {
      type: Number,
      default: 0,
    },
    // Flag for best‑seller products
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate SKU before validation
productSchema.pre('validate', function (next) {
  if (!this.sku) {
    this.sku = 'SKU-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug =
      this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') +
      '-' +
      Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
