const mongoose = require('mongoose');
const User = require('./models/User');

const resetPassword = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect('mongodb://localhost:27017/shipflowx');
    console.log('Connected successfully.');

    const email = 'varun9087@gmail.com';
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`User with email ${email} not found!`);
      // Auto-create user if not found
      console.log('Creating Admin User...');
      await User.create({
        name: 'varunb',
        email,
        password: 'Varun*9997',
        role: 'admin'
      });
      console.log('Admin User created successfully with password: Varun*9997');
    } else {
      user.password = 'Varun*9997';
      await user.save();
      console.log(`Password for ${email} has been updated to: Varun*9997`);
    }

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error resetting password:', err.message);
  }
};

resetPassword();
