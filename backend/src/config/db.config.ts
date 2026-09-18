import mongoose from 'mongoose';
import { envConfig, maskMongoUri } from './env.config.js';
import { logger } from './logger.config.js';

export interface DatabaseStatus {
  isConnected: boolean;
  readyState: number;
  readyStateLabel: string;
  host?: string;
  name?: string;
  maskedUri: string;
}

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;
  private readonly maxRetries = 5;
  private readonly initialDelayMs = 1000;

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
      logger.info('📦 MongoDB: Connection state -> ACTIVE');
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      logger.error('❌ MongoDB: Runtime connection error: %s', err.message);
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

  /**
   * Diagnose connection errors with actionable root-cause explanations
   */
  private diagnoseError(error: any): string {
    const msg = error?.message || '';
    const name = error?.name || '';
    const code = error?.code;

    if (msg.includes('ECONNREFUSED') || code === 'ECONNREFUSED') {
      return 'MongoDB Service Offline / Connection Refused (local daemon is not running on the target port)';
    }
    if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo') || code === 'ENOTFOUND') {
      return 'Atlas DNS Resolution Failed (cluster host name not found or internet unreachable)';
    }
    if (name === 'MongoServerError' && (code === 18 || code === 8000 || msg.toLowerCase().includes('auth'))) {
      return 'Database Authentication Failed (invalid username or password in connection URI)';
    }
    if (name === 'MongoServerSelectionError' || msg.includes('ETIMEDOUT') || msg.includes('timed out')) {
      return 'MongoDB Cluster Unreachable / Network Timeout (verify MongoDB Atlas IP Access List / Whitelist and firewall rules)';
    }
    return msg || 'Unknown MongoDB connection error';
  }

  /**
   * Connect to MongoDB with exponential backoff and retry limits
   */
  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      logger.debug('MongoDB is already connected');
      return mongoose;
    }

    const masked = maskMongoUri(envConfig.MONGODB_URI);
    const options: mongoose.ConnectOptions = {
      autoIndex: envConfig.NODE_ENV !== 'production',
      maxPoolSize: envConfig.MONGODB_MAX_POOL_SIZE,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      family: 4,
    };

    let attempt = 0;
    let delay = this.initialDelayMs;

    while (attempt < this.maxRetries) {
      attempt++;
      try {
        logger.info('⏳ [%d/%d] Connecting to MongoDB: %s', attempt, this.maxRetries, masked);
        const conn = await mongoose.connect(envConfig.MONGODB_URI, options);
        this.isConnected = true;

        const host = conn.connection.host || 'unknown-host';
        const dbName = conn.connection.name || 'unknown-db';
        logger.info('✓ MongoDB Connected (%s / %s)', host, dbName);

        return conn;
      } catch (error: any) {
        const diagnosis = this.diagnoseError(error);
        logger.error('✗ MongoDB connection attempt %d failed: %s', attempt, diagnosis);

        if (attempt >= this.maxRetries) {
          logger.error('💥 MongoDB connection failed permanently after %d attempts.', this.maxRetries);
          logger.error('Root Cause: %s', diagnosis);
          logger.error('Action Required: Verify MONGODB_URI in .env and ensure database host is reachable.');
          throw new Error(`MongoDB connection failed: ${diagnosis}`);
        }

        logger.info('🔄 Backing off for %dms before retry %d...', delay, attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff (1s, 2s, 4s, 8s, 16s)
      }
    }

    throw new Error('MongoDB connection failed after maximum retries');
  }

  /**
   * Graceful disconnection
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected && mongoose.connection.readyState === 0) {
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

  /**
   * Real-time status for health checks
   */
  public getStatus(): DatabaseStatus {
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const readyState = mongoose.connection.readyState;
    return {
      isConnected: readyState === 1,
      readyState,
      readyStateLabel: stateMap[readyState] || 'unknown',
      host: mongoose.connection.host || undefined,
      name: mongoose.connection.name || undefined,
      maskedUri: maskMongoUri(envConfig.MONGODB_URI),
    };
  }
}

export const dbConnection = DatabaseConnection.getInstance();
