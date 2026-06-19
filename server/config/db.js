import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      console.warn('MONGODB_URL env variable not found. Falling back to local MongoDB (mongodb://127.0.0.1:27017/pittamdeurali).');
      mongoUrl = 'mongodb://127.0.0.1:27017/pittamdeurali';
    }
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Do not crash the process, but log clearly so development can proceed or fallbacks can be handled
    console.warn("Continuing server execution. Database operations may fail until MongoDB is started.");
  }
};

export default connectDB;
