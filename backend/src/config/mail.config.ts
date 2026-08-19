import nodemailer from 'nodemailer';
import { envConfig } from './env.config.js';
import { logger } from './logger.config.js';

export const mailTransporter = nodemailer.createTransport({
  host: envConfig.SMTP_HOST,
  port: envConfig.SMTP_PORT,
  secure: envConfig.SMTP_PORT === 465,
  auth: {
    user: envConfig.SMTP_USER,
    pass: envConfig.SMTP_PASS,
  },
});

export const mailConfig = {
  fromName: envConfig.EMAIL_FROM_NAME,
  fromAddress: envConfig.EMAIL_FROM_ADDRESS,
  defaultSender: `"${envConfig.EMAIL_FROM_NAME}" <${envConfig.EMAIL_FROM_ADDRESS}>`,
};

logger.debug('Nodemailer SMTP transporter initialized');
