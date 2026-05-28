import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_pokhara');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Do not crash the process, but log clearly so development can proceed or fallbacks can be handled
    console.warn("Continuing server execution. Database operations may fail until MongoDB is started.");
  }
};

export default connectDB;
