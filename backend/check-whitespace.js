const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const Product = require('./src/models/Product');
    const products = await Product.find({});
    
    let issues = 0;
    products.forEach((p) => {
      p.images.forEach((img) => {
        if (img.url !== img.url.trim()) {
          console.log(`Whitespace in URL for ${p.name}: '${img.url}'`);
          issues++;
        }
      });
    });
    if(issues === 0) console.log("No whitespace issues.");
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
