const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const Product = require('./src/models/Product');
    const products = await Product.find({});
    
    products.forEach(p => {
      p.images.forEach((img) => {
        if (img.url.startsWith('/')) {
          console.log(`Local path found in product ${p.name}: ${img.url}`);
        }
      });
    });
    console.log("Done checking local paths.");
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
