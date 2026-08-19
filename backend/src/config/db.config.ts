import mongoose from 'mongoose';
import { envConfig } from './env.config.js';
import { logger } from './logger.config.js';

interface DatabaseConnectionOptions {
  autoIndex?: boolean;
  maxPoolSize?: number;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
}

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('📦 MongoDB: Connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      logger.error('❌ MongoDB: Connection error occurred: %s', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('⚠️ MongoDB: Disconnected from database cluster');
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      logger.info('🔄 MongoDB: Reconnected to database cluster');
    });
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected) {
      logger.debug('MongoDB is already connected');
      return mongoose;
    }

    const options: DatabaseConnectionOptions = {
      autoIndex: envConfig.NODE_ENV !== 'production',
      maxPoolSize: envConfig.MONGODB_MAX_POOL_SIZE,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    try {
      logger.info('⏳ Connecting to MongoDB at %s...', envConfig.MONGODB_URI);
      const conn = await mongoose.connect(envConfig.MONGODB_URI, options as mongoose.ConnectOptions);
      this.isConnected = true;
      return conn;
    } catch (error: any) {
      logger.error('❌ Failed to connect to MongoDB: %s', error.message);
      // In development, if local MongoDB is temporarily down, log warning instead of crashing the entire build
      if (envConfig.NODE_ENV === 'production') {
        throw error;
      }
      return mongoose;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('🔌 MongoDB: Disconnected gracefully');
    } catch (error: any) {
      logger.error('❌ Error during MongoDB disconnection: %s', error.message);
    }
  }

  public getStatus(): { isConnected: boolean; readyState: number; host?: string; name?: string } {
    return {
      isConnected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

export const dbConnection = DatabaseConnection.getInstance();
