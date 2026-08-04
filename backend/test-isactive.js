const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const User = require('./src/models/User');
    const user = await User.findOne({email: 'admin@ecommerce.com'}).select('+password');
    if(user) {
      console.log('User found');
      console.log('isActive:', user.isActive);
    } else {
      console.log('User not found');
    }
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
