const mongoose = require('mongoose');

const checkUsers = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect('mongodb://localhost:27017/shipflowx');
    console.log('Connected successfully.\n');

    // Define temporary schema to query User collection
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String,
      createdAt: Date
    });

    const User = mongoose.model('User', UserSchema);

    const users = await User.find();
    console.log('--- REGISTERED USERS IN SHIPFLOWX ---');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach((user, idx) => {
        console.log(`${idx + 1}. Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}\n`);
      });
    }

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error querying users:', error.message);
  }
};

checkUsers();
