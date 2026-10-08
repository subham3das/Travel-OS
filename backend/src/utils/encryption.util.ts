import crypto from 'crypto';
import { envConfig } from '../config/env.config.js';

// Derive a 32-byte key from JWT_ACCESS_SECRET or fallback
const ENCRYPTION_SECRET = envConfig.JWT_ACCESS_SECRET || 'travelos_super_secure_access_secret_key_32_chars_min';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

const getCipherKey = (): Buffer => {
  return crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
};

/**
 * Encrypt sensitive plain text using AES-256-GCM
 * Output format: iv:authTag:encryptedHex
 */
export const encryptSensitiveData = (plainText: string): string => {
  if (!plainText) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getCipherKey(), iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt ciphertext encrypted with AES-256-GCM
 */
export const decryptSensitiveData = (cipherText: string): string => {
  if (!cipherText) return '';
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      // If legacy unencrypted, return as is (for backwards compatibility)
      return cipherText;
    }
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getCipherKey(), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    // If decryption fails, return empty string for safety
    return '';
  }
};

/**
 * Mask account number for safe display in UI/API
 * Example: '123456789012' -> '•••• •••• 9012' or 'XXXXXXXX9012'
 */
export const maskAccountNumber = (accountNumber: string, prefix = '•••• •••• '): string => {
  if (!accountNumber) return '';
  const cleaned = accountNumber.replace(/\s+/g, '');
  if (cleaned.length <= 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `${prefix}${last4}`;
};
