const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/ecommerce').then(async () => {
  try {
    const User = require('./src/models/User');
    const user = await User.findOne({email: 'admin@ecommerce.com'}).select('+password');
    if(user) {
      console.log('User found');
      console.log('Password hash:', user.password);
      const match = await user.comparePassword('admin123');
      console.log('Match:', match);
      
      const match2 = await bcrypt.compare('admin123', user.password);
      console.log('Direct bcrypt match:', match2);
    } else {
      console.log('User not found');
    }
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
