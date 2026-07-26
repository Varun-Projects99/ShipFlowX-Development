const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shipflowx';
    // Sanitizing string for secure logs (hides password inside console stdout)
    const sanitizedUri = rawUri.replace(/:([^:@]+)@/, ':******@');
    
    console.log(`Connecting to database: ${sanitizedUri}...`);
    const conn = await mongoose.connect(rawUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
