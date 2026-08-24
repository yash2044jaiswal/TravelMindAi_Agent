import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127017/travelmind';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;