import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error('MONGODB_URL is required');
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
