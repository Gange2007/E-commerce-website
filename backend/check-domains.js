const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const Product = require('./src/models/Product');
    const products = await Product.find({});
    
    let domains = new Set();
    products.forEach(p => {
      p.images.forEach((img) => {
        try {
          let url = new URL(img.url);
          domains.add(url.hostname);
        } catch(e) {
          console.log(`Invalid URL for product ${p.name}: ${img.url}`);
        }
      });
    });
    console.log("Domains found:", Array.from(domains));
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
