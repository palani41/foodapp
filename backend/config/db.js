import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  // 1. Attempt standard connection first if MONGODB_URI is provided
  if (process.env.MONGODB_URI) {
    try {
      console.log('Attempting to connect to MONGODB_URI...');
      // Set short connection timeout so it fails fast if not running
      const options = {
        serverSelectionTimeoutMS: 3000 // 3 seconds timeout
      };
      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.warn(`Standard MongoDB connection failed: ${error.message}`);
    }
  }

  // 2. Fallback to MongoMemoryServer
  try {
    console.log('Starting In-Memory MongoDB Server fallback...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Override MONGODB_URI env so other modules can use it
    process.env.MONGODB_URI = uri;
    
    await mongoose.connect(uri);
    console.log(`In-Memory MongoDB Connected at: ${uri}`);
  } catch (error) {
    console.error(`Failed to start In-Memory MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error(`Error disconnecting database: ${error.message}`);
  }
};

export default connectDB;
