import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    
    // Define connection options
    const connectionOptions = {
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Pass the options to the connect method
    const conn = await mongoose.connect(mongoURI, connectionOptions);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle MongoDB connection events
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