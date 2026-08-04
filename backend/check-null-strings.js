const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const Product = require('./src/models/Product');
    const products = await Product.find({});
    
    products.forEach((p) => {
      p.images.forEach((img) => {
        if (img.url === "undefined" || img.url === "null" || img.url.includes("undefined") || img.url.includes("null")) {
          console.log(`Bad string URL in product ${p.name}: ${img.url}`);
        }
      });
    });
    console.log("Done checking string null/undefined.");
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
