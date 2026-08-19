import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { envConfig } from './env.config.js';

// Ensure logs directory exists
const logDirectory = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Custom log format for readable output
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
  })
);

// Daily file rotation transports
const combinedFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: logFormat,
});

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: logFormat,
});

export const logger = winston.createLogger({
  level: envConfig.LOG_LEVEL || (envConfig.NODE_ENV === 'development' ? 'debug' : 'info'),
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    combinedFileTransport,
    errorFileTransport,
  ],
});
