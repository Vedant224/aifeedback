import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    
    const connectionOptions = {
      autoIndex: true, 
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, 
    };

    const conn = await mongoose.connect(mongoURI, connectionOptions);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;