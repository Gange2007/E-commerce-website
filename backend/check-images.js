const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const Product = require('./src/models/Product');
    const products = await Product.find({});
    
    let brokenProducts = [];
    products.forEach(p => {
      let issues = [];
      if (!p.images || p.images.length === 0) {
        issues.push('No images array or empty');
      } else {
        p.images.forEach((img, idx) => {
          if (!img.url) {
            issues.push(`Image ${idx} missing url field`);
          } else if (img.url.trim() === '') {
            issues.push(`Image ${idx} has empty url`);
          } else if (!img.url.startsWith('http') && !img.url.startsWith('/')) {
            issues.push(`Image ${idx} URL might be malformed: ${img.url}`);
          }
        });
      }
      
      if (issues.length > 0) {
        brokenProducts.push({ id: p._id, name: p.name, issues });
      }
    });
    
    console.log('Total products:', products.length);
    console.log('Products with image issues:', brokenProducts.length);
    if (brokenProducts.length > 0) {
      console.log(JSON.stringify(brokenProducts, null, 2));
    } else {
      console.log("No obvious issues found in database image URLs.");
    }
    
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
