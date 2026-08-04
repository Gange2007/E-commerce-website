const dns = require("dns");

// Force Google DNS for Node resolver
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      family: 4
    });

    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const categories = [
  { name: 'Electronics', description: 'Gadgets and tech products', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Clothing', description: 'Fashion and apparel', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
  { name: 'Books', description: 'Books and literature', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
  { name: 'Home & Garden', description: 'Home decor and garden', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
  { name: 'Sports', description: 'Sports and fitness', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Beauty', description: 'Beauty and personal care', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
];

const seedDB = async () => {
  try {
    await connectDB();

    // 1. Drop existing indexes on Product collection to clear corrupted { slug: null } indexes
    try {
      await Product.collection.dropIndexes();
      console.log('Dropped old indexes');
    } catch (err) {
      console.log('No indexes to drop or collection clean');
    }

    // 2. Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // 3. Create users
    await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });
    console.log('Users created');

    // 4. Create categories
    const createdCategories = [];
    for (const cat of categories) {
      const c = await Category.create(cat);
      createdCategories.push(c);
    }
    console.log('Categories created');

    const electronics = createdCategories.find(c => c.name === 'Electronics');
    const clothing = createdCategories.find(c => c.name === 'Clothing');
    const books = createdCategories.find(c => c.name === 'Books');
    const homeGarden = createdCategories.find(c => c.name === 'Home & Garden');
    const sports = createdCategories.find(c => c.name === 'Sports');
    const beauty = createdCategories.find(c => c.name === 'Beauty');

    const products = [
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
        price: 14999,
        originalPrice: 19999,
        discountPercentage: 25,
        category: electronics._id,
        brand: 'SoundMax',
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600' },
        ],
        stock: 50,
        isFeatured: true,
        rating: 4.5,
        numReviews: 128,
        sold: 342,
        tags: ['wireless', 'headphones', 'audio'],
      },
      {
        name: 'Smartphone Pro Max',
        description: 'Latest flagship smartphone with 6.7" OLED display, 200MP camera, and all-day battery.',
        price: 69999,
        originalPrice: 84999,
        discountPercentage: 18,
        category: electronics._id,
        brand: 'TechPro',
        images: [
          { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' },
          { url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600' },
        ],
        stock: 30,
        isFeatured: true,
        rating: 4.7,
        numReviews: 256,
        sold: 189,
        tags: ['smartphone', 'mobile', 'tech'],
      },
      {
        name: 'Ultra-Slim Laptop 14"',
        description: 'Powerful ultrabook with Intel Core i7, 16GB RAM, 512GB SSD, and stunning display.',
        price: 74999,
        originalPrice: 94999,
        discountPercentage: 21,
        category: electronics._id,
        brand: 'TechPro',
        images: [
          { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600' },
        ],
        stock: 20,
        isFeatured: true,
        rating: 4.6,
        numReviews: 89,
        sold: 145,
        tags: ['laptop', 'computer', 'ultrabook'],
      },
      {
        name: 'Smart Watch Series 5',
        description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
        price: 24999,
        originalPrice: 34999,
        discountPercentage: 29,
        category: electronics._id,
        brand: 'SmartWear',
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
          { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600' },
        ],
        stock: 75,
        isFeatured: true,
        rating: 4.4,
        numReviews: 201,
        sold: 428,
        tags: ['smartwatch', 'wearable', 'fitness'],
      },
      {
        name: 'Premium Cotton T-Shirt',
        description: '100% organic cotton t-shirt with a comfortable fit and modern design.',
        price: 899,
        originalPrice: 1399,
        discountPercentage: 36,
        category: clothing._id,
        brand: 'StyleBrand',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
          { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600' },
        ],
        stock: 200,
        isFeatured: false,
        rating: 4.2,
        numReviews: 67,
        sold: 892,
        tags: ['tshirt', 'clothing', 'cotton'],
      },
      {
        name: 'Running Sneakers Pro',
        description: 'High-performance running shoes with advanced cushioning and breathable mesh upper.',
        price: 7999,
        originalPrice: 11999,
        discountPercentage: 33,
        category: sports._id,
        brand: 'RunFast',
        images: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
          { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600' },
        ],
        stock: 85,
        isFeatured: true,
        rating: 4.8,
        numReviews: 334,
        sold: 623,
        tags: ['shoes', 'running', 'sports'],
      },
      {
        name: 'JavaScript: The Complete Guide',
        description: 'Comprehensive guide to modern JavaScript, ES6+, and web development best practices.',
        price: 699,
        originalPrice: 999,
        discountPercentage: 30,
        category: books._id,
        brand: 'TechBooks',
        images: [
          { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600' },
          { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600' },
        ],
        stock: 150,
        isFeatured: false,
        rating: 4.6,
        numReviews: 112,
        sold: 287,
        tags: ['javascript', 'programming', 'book'],
      },
      {
        name: 'Luxury Skincare Set',
        description: 'Complete skincare routine with cleanser, serum, moisturizer, and SPF protection.',
        price: 3499,
        originalPrice: 4999,
        discountPercentage: 30,
        category: beauty._id,
        brand: 'GlowBeauty',
        images: [
          { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600' },
          { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600' },
        ],
        stock: 60,
        isFeatured: true,
        rating: 4.5,
        numReviews: 178,
        sold: 445,
        tags: ['skincare', 'beauty', 'cosmetics'],
      },
      {
        name: 'Modern Floor Lamp',
        description: 'Elegant minimalist floor lamp with adjustable brightness and warm LED lighting.',
        price: 3999,
        originalPrice: 5499,
        discountPercentage: 27,
        category: homeGarden._id,
        brand: 'HomeStyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600' },
          { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
        ],
        stock: 40,
        isFeatured: false,
        rating: 4.3,
        numReviews: 55,
        sold: 163,
        tags: ['lamp', 'lighting', 'home'],
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip premium yoga mat with alignment lines, extra thick cushioning.',
        price: 1999,
        originalPrice: 2999,
        discountPercentage: 33,
        category: sports._id,
        brand: 'FitLife',
        images: [
          { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600' },
          { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600' },
        ],
        stock: 120,
        isFeatured: false,
        rating: 4.7,
        numReviews: 243,
        sold: 356,
        tags: ['yoga', 'fitness', 'sports'],
      },
    ];

    // 5. Create products using Product.create() with generated slugs
    for (const product of products) {
      await Product.create({
        ...product,
        slug: generateSlug(product.name),
      });
    }

    console.log('Products created successfully');
    console.log('Database seeded successfully');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();