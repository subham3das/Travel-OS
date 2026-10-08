import nodemailer from 'nodemailer';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const getEmailLogoHtml = (bgIsDark: boolean = true, height: number = 34): string => {
  const baseUrl = (envConfig.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
  const logoFileName = bgIsDark ? 'logo-dark.png' : 'logo-light.png';
  return `<img src="${baseUrl}/logo/${logoFileName}" alt="ApnaTrip" height="${height}" style="height:${height}px; width:auto; max-width:200px; display:inline-block; border:0; vertical-align:middle;" />`;
};

export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport({
        host: envConfig.SMTP_HOST,
        port: envConfig.SMTP_PORT,
        secure: envConfig.SMTP_PORT === 465, // true for 465, false for 587
        auth: {
          user: envConfig.SMTP_USER,
          pass: envConfig.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Prevents self-signed cert issues on some proxies
        },
      });

      logger.info('📧 MailService initialized with host: %s, port: %d', envConfig.SMTP_HOST, envConfig.SMTP_PORT);
    } catch (error) {
      logger.error('❌ Failed to initialize MailService transporter:', error);
    }
  }

  /**
   * Generic Send Email Method with Automatic Retry & Format Validation
   */
  public async sendMail(options: SendEmailOptions): Promise<nodemailer.SentMessageInfo> {
    if (!options.to || typeof options.to !== 'string') {
      throw new Error('Recipient email address is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(options.to.trim())) {
      throw new Error(`Invalid email address format: ${options.to}`);
    }

    if (!this.transporter) {
      this.initializeTransporter();
    }

    if (!this.transporter) {
      throw new Error('Email transporter is not available. Please verify SMTP configuration.');
    }

    const fromAddress = `"${envConfig.EMAIL_FROM_NAME}" <${envConfig.EMAIL_FROM_ADDRESS}>`;

    const mailOptions = {
      from: fromAddress,
      to: options.to.trim(),
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
      html: options.html,
    };

    let lastError: any = null;
    const maxRetries = 2; // Up to 3 attempts total

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        logger.info(
          '✉️ Email delivered successfully to %s [Message ID: %s] (Attempt %d)',
          options.to,
          info.messageId,
          attempt
        );
        return info;
      } catch (err: any) {
        lastError = err;
        logger.warn(
          '⚠️ SMTP send attempt %d/%d failed for %s: %s',
          attempt,
          maxRetries + 1,
          options.to,
          err.message
        );
        if (attempt <= maxRetries) {
          // Exponential backoff
          await new Promise((res) => setTimeout(res, attempt * 500));
        }
      }
    }

    logger.error('❌ SMTP Dispatch Error to %s after %d attempts: %s', options.to, maxRetries + 1, lastError?.message);
    throw lastError;
  }

  /**
   * Non-Throwing Safe Email Dispatcher (for non-blocking background notifications)
   */
  public async sendMailSafe(
    options: SendEmailOptions
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const info = await this.sendMail(options);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      logger.error('❌ sendMailSafe suppressed background email failure for %s: %s', options.to, err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Send Professional Administrator Password Reset Email
   */
  public async sendPasswordResetEmail(
    to: string,
    recipientName: string,
    resetLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[ApnaTrip] Administrator Password Reset Request`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #6356E5 0%, #4338CA 100%);
      padding: 32px 30px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .message {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 28px;
    }
    .btn-container {
      text-align: center;
      margin-bottom: 32px;
    }
    .btn {
      display: inline-block;
      background-color: #6356E5;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 800;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(99, 86, 229, 0.35);
    }
    .info-box {
      background-color: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 12px;
      color: #64748b;
    }
    .link-fallback {
      font-size: 11px;
      color: #94a3b8;
      word-break: break-all;
      line-height: 1.5;
    }
    .link-fallback a {
      color: #6356E5;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding: 24px 32px;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      background-color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${recipientName || 'Administrator'},</h2>
        <p class="message">
          We received a request to reset the administrator password for your ApnaTrip account. Click the button below to create a new password.
        </p>
        <div class="btn-container">
          <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
        </div>
        <div class="info-box">
          <strong>Security Notice:</strong> This password reset link is securely encrypted and will automatically expire in <strong>15 minutes</strong>. If you did not initiate this request, please ignore this email or notify your system administrator immediately.
        </div>
        <div class="link-fallback">
          If the button above does not work, copy and paste this URL into your browser:<br>
          <a href="${resetLink}">${resetLink}</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.<br>
        Security Operations Center • Automated Verification System
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject,
      html,
    });
  }

  /**
   * Send Professional Partner Email Verification OTP Email
   */
  public async sendPartnerOtpEmail(params: {
    to: string;
    recipientName: string;
    otp: string;
    expiresInMinutes?: number;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { to, recipientName, otp, expiresInMinutes = 10 } = params;
    const subject = `Verify your ApnaTrip Account - ${otp}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your ApnaTrip Account</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #583BE8 100%); padding: 36px 32px; text-align: center; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .otp-box { background: #F5F3FF; border: 2px dashed #583BE8; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #583BE8; margin: 0; }
    .otp-hint { font-size: 12px; font-weight: 600; color: #64748B; margin-top: 8px; }
    .info-box { background: #f8fafc; border-left: 4px solid #583BE8; padding: 14px 16px; border-radius: 8px; font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px; }
    .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true, 36)}
      </div>
      <div class="content">
        <h2 class="greeting">Welcome to ApnaTrip, ${recipientName || 'Partner'}!</h2>
        <p class="message">
          Thank you for starting your partner account registration. Please use the following 6-digit verification code to confirm your email address:
        </p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-hint">Valid for ${expiresInMinutes} minutes</div>
        </div>
        <div class="info-box">
          <strong>Security Notice:</strong> Never share this code with anyone. ApnaTrip will never ask for your verification code by phone or messaging apps.
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Partner Platform. All rights reserved.<br>
        Autonomous SaaS Onboarding Security
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMailSafe({ to, subject, html });
  }

  /**
   * Send Professional Agency Verification Approval & Auto Account Creation Email
   */
  public async sendAgencyApprovedEmail(params: {
    to: string;
    ownerName: string;
    agencyName: string;
    agencyId: string;
    approvalDateFormatted: string;
    loginLink: string;
    loginEmail: string;
    tempPassword: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const {
      to,
      ownerName,
      agencyName,
      agencyId,
      approvalDateFormatted,
      loginLink,
      loginEmail,
      tempPassword,
    } = params;

    const subject = `🎉 Your ApnaTrip Partner Account has been Approved`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partner Account Approved</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); }
    .header { background: linear-gradient(135deg, #583BE8 0%, #4328c7 100%); padding: 32px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0; }
    .sub-badge { display: inline-block; background: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 14px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    
    .card { background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px; }
    .card-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #583BE8; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .label { color: #64748b; font-weight: 600; }
    .val { color: #0f172a; font-weight: 700; text-align: right; }
    .status-badge { background-color: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 11px; }

    .credentials-box { background-color: #fdf4ff; border-radius: 12px; border: 1px solid #f0abfc; padding: 20px; margin-bottom: 24px; }
    .cred-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #a21caf; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #fae8ff; padding-bottom: 8px; }
    .code-box { background-color: #ffffff; border: 1px dashed #d946ef; padding: 8px 14px; border-radius: 8px; font-family: monospace; font-size: 15px; font-weight: 800; color: #86198f; letter-spacing: 1px; }
    .security-note { font-size: 12px; color: #b45309; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; margin-top: 14px; line-height: 1.5; }

    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #583BE8; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 14px rgba(88, 59, 232, 0.35); }

    .features-grid { margin-bottom: 24px; }
    .feature-item { font-size: 13px; color: #334155; margin-bottom: 6px; }
    .feature-check { color: #10b981; font-weight: 900; margin-right: 6px; }

    .support-box { background-color: #f1f5f9; border-radius: 10px; padding: 14px 18px; font-size: 12px; color: #475569; margin-bottom: 24px; line-height: 1.6; }
    .support-box a { color: #583BE8; text-decoration: none; font-weight: 700; }

    .signature { font-size: 13px; color: #334155; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 20px; }
    .sig-name { font-weight: 800; color: #0f172a; }
    .sig-title { color: #64748b; font-size: 12px; }

    .footer { border-top: 1px solid #f1f5f9; padding: 20px 32px; font-size: 11px; color: #94a3b8; text-align: center; background-color: #fafbfc; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
        <div class="sub-badge">Official Partner Network</div>
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${ownerName},</h2>
        <p class="message">
          <strong>Congratulations!</strong><br>
          We are pleased to inform you that your travel agency has successfully completed the verification process and has been approved to become an official <strong>ApnaTrip Partner</strong>.
        </p>
        <p class="message">
          Your agency can now access the Partner Dashboard, create travel packages, manage bookings, communicate with travelers, and grow your business with thousands of potential customers across India.
        </p>

        <!-- Agency Details Card -->
        <div class="card">
          <div class="card-title">Agency Details</div>
          <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td class="label">Agency Name:</td>
              <td class="val"><strong>${agencyName}</strong></td>
            </tr>
            <tr>
              <td class="label">Agency ID:</td>
              <td class="val"><code style="font-family: monospace; font-weight: bold; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${agencyId}</code></td>
            </tr>
            <tr>
              <td class="label">Verification Status:</td>
              <td class="val"><span class="status-badge">✓ Approved</span></td>
            </tr>
            <tr>
              <td class="label">Approval Date:</td>
              <td class="val">${approvalDateFormatted}</td>
            </tr>
          </table>
        </div>

        <!-- Login Credentials Card -->
        <div class="credentials-box">
          <div class="cred-title">🔐 Your Partner Login Credentials</div>
          <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; margin-bottom: 8px;">
            <tr>
              <td class="label" style="color: #86198f;">Partner Dashboard:</td>
              <td class="val"><a href="${loginLink}" style="color: #583BE8; font-weight: 700; text-decoration: none;" target="_blank">${loginLink}</a></td>
            </tr>
            <tr>
              <td class="label" style="color: #86198f;">Login ID:</td>
              <td class="val"><strong>${loginEmail}</strong></td>
            </tr>
            <tr>
              <td class="label" style="color: #86198f;">Temporary Password:</td>
              <td class="val"><span class="code-box">${tempPassword}</span></td>
            </tr>
          </table>

          <div class="security-note">
            ⚠️ <strong>Security Notice:</strong> For your account security, please change your password immediately after your first login.
          </div>
        </div>

        <div class="btn-container">
          <a href="${loginLink}" class="btn" target="_blank">Sign In to Partner Dashboard</a>
        </div>

        <!-- What you can do -->
        <div style="margin-bottom: 24px;">
          <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 10px;">What You Can Do:</strong>
          <table width="100%" cellpadding="3" cellspacing="0" style="font-size: 13px; color: #334155;">
            <tr>
              <td><span class="feature-check">✓</span> Create Tour Packages</td>
              <td><span class="feature-check">✓</span> Manage Bookings</td>
            </tr>
            <tr>
              <td><span class="feature-check">✓</span> Receive Customer Inquiries</td>
              <td><span class="feature-check">✓</span> Track Revenue</td>
            </tr>
            <tr>
              <td><span class="feature-check">✓</span> Manage Trips</td>
              <td><span class="feature-check">✓</span> View Analytics</td>
            </tr>
            <tr>
              <td><span class="feature-check">✓</span> Manage Travelers</td>
              <td><span class="feature-check">✓</span> Receive Payments</td>
            </tr>
          </table>
        </div>

        <div class="support-box">
          <strong>Need Help?</strong><br>
          If you experience any issues accessing your dashboard, feel free to contact our support team at <a href="mailto:support@apnatrip.com">support@apnatrip.com</a>.
        </div>

        <p class="message" style="margin-bottom: 20px;">
          We are excited to have you as one of our trusted travel partners and look forward to helping your business grow.
        </p>

        <div class="signature">
          Warm Regards,<br>
          <span class="sig-name">Subham Das</span><br>
          <span class="sig-title">Founder & CEO, ApnaTrip</span>
        </div>
      </div>
      <div class="footer">
        This is an automated email. Please do not reply directly to this message.<br>
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Agency Verification Rejection Email
   */
  public async sendAgencyRejectedEmail(
    to: string,
    agencyName: string,
    reason: string,
    reapplyLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `Update Regarding Your Agency Application - ApnaTrip`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Status Update</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); padding: 32px 30px; text-align: center; }
    .logo { font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .btn-container { text-align: center; margin-bottom: 32px; }
    .btn { display: inline-block; background-color: #6356E5; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; }
    .reason-box { background-color: #fef2f2; border-radius: 12px; border: 1px solid #fecaca; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #991b1b; }
    .footer { border-top: 1px solid #f1f5f9; padding: 24px 32px; font-size: 11px; color: #94a3b8; text-align: center; background-color: #ffffff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${agencyName},</h2>
        <p class="message">
          Thank you for your interest in partnering with ApnaTrip. Following review of your application, our compliance team was unable to approve the registration due to the following reason:
        </p>
        <div class="reason-box">
          <strong>Reason for Decision:</strong><br>
          ${reason}
        </div>
        <p class="message">
          You may review your details and re-apply with corrected documentation at any time.
        </p>
        <div class="btn-container">
          <a href="${reapplyLink}" class="btn" target="_blank">Re-apply with Updated Info</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.<br>
        Agency Partner Compliance Department
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Agency Document Request Notification Email
   */
  public async sendAgencyMissingDocsEmail(
    to: string,
    agencyName: string,
    missingDocs: string[],
    notes: string,
    uploadLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `Action Required: Additional Documents Requested for Your Agency Application`;

    const docListHtml = missingDocs.map((doc) => `<li><strong>${doc}</strong></li>`).join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Action Required: Documents Needed</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 32px 30px; text-align: center; }
    .logo { font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .btn-container { text-align: center; margin-bottom: 32px; }
    .btn { display: inline-block; background-color: #F59E0B; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; }
    .docs-box { background-color: #fffbeb; border-radius: 12px; border: 1px solid #fde68a; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #92400e; }
    .footer { border-top: 1px solid #f1f5f9; padding: 24px 32px; font-size: 11px; color: #94a3b8; text-align: center; background-color: #ffffff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${agencyName},</h2>
        <p class="message">
          Our compliance team is currently reviewing your agency application and requires additional documentation to complete your verification:
        </p>
        <div class="docs-box">
          <strong>Requested Documents:</strong>
          <ul>${docListHtml}</ul>
          ${notes ? `<p><em>Notes: ${notes}</em></p>` : ''}
        </div>
        <div class="btn-container">
          <a href="${uploadLink}" class="btn" target="_blank">Upload Required Documents</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.<br>
        Agency Partner Verification Operations
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Application Confirmation to Prospective Agency
   */
  public async sendAgencyApplicationReceivedEmail(
    to: string,
    agencyName: string,
    applicationId: string,
    trackLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `Application Received: ${agencyName} [${applicationId}] — ApnaTrip`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #583BE8; padding: 32px; text-align: center; color: #ffffff; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .app-box { background-color: #f1f5f9; border-radius: 12px; border: 1px solid #cbd5e1; padding: 20px; margin-bottom: 24px; text-align: center; }
    .app-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .app-id { font-size: 22px; font-weight: 800; color: #583BE8; letter-spacing: 1px; }
    .btn-container { text-align: center; margin-bottom: 32px; }
    .btn { display: inline-block; background-color: #583BE8; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; }
    .footer { border-top: 1px solid #f1f5f9; padding: 24px 32px; font-size: 11px; color: #94a3b8; text-align: center; background-color: #ffffff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${agencyName},</h2>
        <p class="message">
          Thank you for registering with ApnaTrip! We have successfully received your agency onboarding application. Our compliance and verification team is currently reviewing your business information and submitted KYC documentation.
        </p>
        <div class="app-box">
          <div class="app-label">Your Application Reference Number</div>
          <div class="app-id">${applicationId}</div>
        </div>
        <p class="message">
          Standard review times are between <strong>24 to 48 business hours</strong>. You will receive an email notification as soon as your verification status changes.
        </p>
        <div class="btn-container">
          <a href="${trackLink}" class="btn" target="_blank">Track Application Status</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.<br>
        Agency Partner Operations
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Registration Received Email (with Reference Number, Payment Success & Pending Approval status)
   */
  public async sendPartnerRegistrationReceivedEmail(params: {
    to: string;
    businessName: string;
    serviceType: 'Travel Agency' | 'Car Rental';
    referenceNumber: string;
    paymentId: string;
    amountPaid: number;
    trackLink?: string;
    supportContact?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const {
      to,
      businessName,
      serviceType,
      referenceNumber,
      paymentId,
      amountPaid,
      trackLink = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/agency/verification-pending`,
      supportContact = 'support@apnatrip.com',
    } = params;

    const subject = `Registration Received: ${businessName} [${referenceNumber}] - ApnaTrip Partner Network`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Partner Registration Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #583BE8; padding: 32px; text-align: center; color: #ffffff; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .app-box { background-color: #f1f5f9; border-radius: 12px; border: 1px solid #cbd5e1; padding: 20px; margin-bottom: 24px; text-align: center; }
    .app-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .app-id { font-size: 22px; font-weight: 800; color: #583BE8; letter-spacing: 1px; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    .details-table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .details-table .label { color: #64748b; font-weight: 600; width: 40%; }
    .details-table .val { color: #0f172a; font-weight: 700; text-align: right; }
    .badge-success { background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; }
    .badge-pending { background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; }
    .btn-container { text-align: center; margin-bottom: 28px; }
    .btn { display: inline-block; background-color: #583BE8; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; }
    .footer { border-top: 1px solid #f1f5f9; padding: 24px 32px; font-size: 11px; color: #94a3b8; text-align: center; background-color: #ffffff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${businessName},</h2>
        <p class="message">
          Thank you! Your payment has been received and your <strong>${serviceType}</strong> registration has been submitted for review.
        </p>
        <div class="app-box">
          <div class="app-label">Reference Number</div>
          <div class="app-id">${referenceNumber}</div>
        </div>

        <table class="details-table">
          <tr>
            <td class="label">Business Name:</td>
            <td class="val">${businessName}</td>
          </tr>
          <tr>
            <td class="label">Service Category:</td>
            <td class="val">${serviceType}</td>
          </tr>
          <tr>
            <td class="label">Payment Status:</td>
            <td class="val"><span class="badge-success">✓ Payment Success (₹${amountPaid})</span></td>
          </tr>
          <tr>
            <td class="label">Payment ID:</td>
            <td class="val"><code>${paymentId}</code></td>
          </tr>
          <tr>
            <td class="label">Application Status:</td>
            <td class="val"><span class="badge-pending">⏳ Pending Approval</span></td>
          </tr>
          <tr>
            <td class="label">Estimated Review:</td>
            <td class="val">24–48 Business Hours</td>
          </tr>
        </table>

        <p class="message">
          Our compliance and onboarding team is verifying your business details and submitted documentation. You will receive an official email confirmation with your credentials as soon as your account is approved.
        </p>

        <div class="btn-container">
          <a href="${trackLink}" class="btn" target="_blank">View Application Status</a>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
          Have questions or need assistance? Contact our Partner Support Team anytime at <a href="mailto:${supportContact}" style="color: #583BE8; text-decoration: none; font-weight: 700;">${supportContact}</a>.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.<br>
        Partner Onboarding & Verification Department
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send New Agency Application Alert to Super Admin
   */
  public async sendSuperAdminNewAgencyAlertEmail(
    to: string,
    agencyName: string,
    applicationId: string,
    reviewLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[Action Required] New Agency Application: ${agencyName} (${applicationId})`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Agency Application</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0F172A; padding: 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 20px; font-weight: 800; margin: 0; }
    .content { padding: 32px; }
    .btn-container { text-align: center; margin: 24px 0; }
    .btn { display: inline-block; background-color: #583BE8; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px; }
    .footer { border-top: 1px solid #f1f5f9; padding: 20px; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
        <div style="font-size: 14px; font-weight: 800; color: #cbd5e1; margin-top: 8px;">Super Admin Security Alert</div>
      </div>
      <div class="content">
        <h2 style="font-size:16px; color:#0f172a; margin-top:0;">New Agency Registration Submitted</h2>
        <p style="font-size:14px; color:#475569; line-height:1.5;">
          A new travel agency partner <strong>${agencyName}</strong> (Application ID: <code>${applicationId}</code>) has submitted their registration and KYC documents for compliance review.
        </p>
        <div class="btn-container">
          <a href="${reviewLink}" class="btn" target="_blank">Review Application in Admin Portal</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Security & Compliance
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Specific Missing Documents Request Email to Agency
   */
  public async sendAgencyDocumentsRequestedEmail(
    to: string,
    agencyName: string,
    applicationId: string,
    requestedDocuments: Array<{
      documentName: string;
      reason: string;
      customReason?: string;
    }>,
    agencyMessage?: string,
    reuploadLink?: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[Action Required] Additional Documents Requested: ${agencyName} [${applicationId}]`;

    const docItemsHtml = requestedDocuments
      .map(
        (d) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-weight: 700; color: #0f172a; font-size: 13px;">${d.documentName}</td>
        <td style="padding: 12px; color: #dc2626; font-size: 13px; font-weight: 600;">
          ${d.reason}${d.customReason ? ` <span style="color:#64748b; font-weight:400;">(${d.customReason})</span>` : ''}
        </td>
      </tr>`
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document Re-upload Requested</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #d97706; padding: 28px; text-align: center; color: #ffffff; }
    .logo { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 14px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .table-container { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background-color: #f8fafc; padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
    .admin-note-box { background-color: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7; padding: 16px; margin-bottom: 24px; }
    .admin-note-label { font-size: 12px; font-weight: 700; color: #b45309; margin-bottom: 4px; }
    .admin-note-text { font-size: 13px; color: #78350f; line-height: 1.5; margin: 0; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #d97706; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; }
    .footer { border-top: 1px solid #f1f5f9; padding: 24px 32px; font-size: 11px; color: #94a3b8; text-align: center; background-color: #ffffff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
        <div style="font-size: 15px; font-weight: 800; color: #fef3c7; margin-top: 8px;">Document Re-upload Required</div>
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${agencyName},</h2>
        <p class="message">
          Our compliance team has reviewed your onboarding application (<strong>${applicationId}</strong>) and requires you to re-upload the following document(s) before we can complete verification:
        </p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Requested Document</th>
                <th>Rejection Reason</th>
              </tr>
            </thead>
            <tbody>
              ${docItemsHtml}
            </tbody>
          </table>
        </div>

        ${
          agencyMessage
            ? `
        <div class="admin-note-box">
          <div class="admin-note-label">Message from Verification Team:</div>
          <p class="admin-note-text">${agencyMessage}</p>
        </div>`
            : ''
        }

        <p class="message">
          Please log into your agency portal or click the button below to upload new, clear copies of the requested documents. All other verified documents remain safely approved and locked.
        </p>

        <div class="btn-container">
          <a href="${reuploadLink || '#'}" class="btn" target="_blank">Re-upload Documents Now</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.<br>
        Agency Compliance & KYC Operations
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Alert to Super Admin when Agency Re-uploads Requested Documents
   */
  public async sendSuperAdminAgencyReuploadAlertEmail(
    to: string,
    agencyName: string,
    applicationId: string,
    reuploadedDocsCount: number,
    reviewLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[Update] Re-uploaded Documents Submitted: ${agencyName} (${applicationId})`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Documents Re-uploaded</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0284c7; padding: 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 20px; font-weight: 800; margin: 0; }
    .content { padding: 32px; }
    .btn-container { text-align: center; margin: 24px 0; }
    .btn { display: inline-block; background-color: #0284c7; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px; }
    .footer { border-top: 1px solid #f1f5f9; padding: 20px; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
        <div style="font-size: 14px; font-weight: 800; color: #e0f2fe; margin-top: 8px;">Agency Update Alert</div>
      </div>
      <div class="content">
        <h2 style="font-size:16px; color:#0f172a; margin-top:0;">Documents Re-uploaded by Agency</h2>
        <p style="font-size:14px; color:#475569; line-height:1.5;">
          The agency partner <strong>${agencyName}</strong> (Application ID: <code>${applicationId}</code>) has re-uploaded <strong>${reuploadedDocsCount}</strong> requested document(s). The application is now pending your re-review.
        </p>
        <div class="btn-container">
          <a href="${reviewLink}" class="btn" target="_blank">Review Re-uploaded Documents</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Security & Compliance
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Professional Agency Password Reset Email (15-min expiry)
   */
  public async sendAgencyPasswordResetEmail(
    to: string,
    agencyName: string,
    resetLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = 'Reset your ApnaTrip Agency Portal password';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #583BE8 0%, #4328c7 100%);
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .sub-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 4px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 8px;
      color: #ffffff;
    }
    .content {
      padding: 36px 32px;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .greeting {
      font-size: 15px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 14px;
    }
    .message {
      font-size: 14px;
      line-height: 1.65;
      color: #475569;
      margin-bottom: 24px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background-color: #583BE8;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 800;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(88, 59, 232, 0.35);
    }
    .warning-box {
      background-color: #fffbeb;
      border-radius: 12px;
      border: 1px solid #fde68a;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #92400e;
      line-height: 1.5;
    }
    .link-fallback {
      font-size: 11px;
      color: #94a3b8;
      word-break: break-all;
      line-height: 1.5;
      margin-bottom: 24px;
      background-color: #f8fafc;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .link-fallback a {
      color: #583BE8;
      text-decoration: none;
      font-weight: 600;
    }
    .signature {
      font-size: 13px;
      color: #334155;
      line-height: 1.6;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
    }
    .sig-name {
      font-weight: 800;
      color: #0f172a;
    }
    .sig-title {
      color: #64748b;
      font-size: 12px;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding: 20px 32px;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      background-color: #fafbfc;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
        <div class="sub-badge">Agency Partner Portal</div>
      </div>
      <div class="content">
        <h2 class="title">Password Reset Request</h2>
        <div class="greeting">Hello ${agencyName || 'Partner'},</div>
        <p class="message">
          We received a request to reset the password for your ApnaTrip Agency account.<br>
          If you requested this change, click the button below to choose a new password.
        </p>
        <div class="btn-container">
          <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
        </div>
        <div class="warning-box">
          ⏱️ <strong>Note:</strong> This link will expire in <strong>15 minutes</strong>.<br>
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </div>
        <div class="link-fallback">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}">${resetLink}</a>
        </div>
        <p class="message" style="margin-bottom: 20px; font-size: 12px; color: #64748b;">
          🔒 For security reasons, never share your login credentials with anyone.
        </p>
        <div class="signature">
          Regards,<br>
          <span class="sig-name">Subham Das</span><br>
          <span class="sig-title">Founder, ApnaTrip</span>
        </div>
      </div>
      <div class="footer">
        This is an automated email.<br>
        Please do not reply.<br>
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Professional Customer / Traveler Password Reset Email (15-Minute Expiry)
   */
  public async sendUserPasswordResetEmail(
    to: string,
    recipientName: string,
    resetLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[ApnaTrip] Reset Your Password`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your ApnaTrip Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #FF4D6D 0%, #E11D48 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff; }
    .tagline { font-size: 13px; font-weight: 600; opacity: 0.9; margin-top: 6px; letter-spacing: 0.5px; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .greeting { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #FF4D6D; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 40px; border-radius: 14px; box-shadow: 0 4px 14px rgba(255, 77, 109, 0.35); }
    .warning-box { background-color: #FFFBEB; border-radius: 12px; border: 1px solid #FDE68A; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #92400E; line-height: 1.5; }
    .link-fallback { font-size: 11px; color: #94A3B8; word-break: break-all; line-height: 1.5; margin-bottom: 24px; background-color: #F8FAFC; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0; }
    .link-fallback a { color: #FF4D6D; text-decoration: none; font-weight: 600; }
    .signature { font-size: 13px; color: #334155; line-height: 1.6; border-top: 1px solid #F1F5F9; padding-top: 20px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
        <div class="tagline">Explore The World With Confidence</div>
      </div>
      <div class="content">
        <h2 class="title">Password Reset Request</h2>
        <div class="greeting">Hello ${recipientName || 'Traveler'},</div>
        <p class="message">
          We received a request to reset your ApnaTrip account password. If you initiated this request, please click the button below to choose your new password.
        </p>
        <div class="btn-container">
          <a href="${resetLink}" class="btn" target="_blank">Reset My Password</a>
        </div>
        <div class="warning-box">
          ⏱️ <strong>Strict Security Notice:</strong> This link will expire in exactly <strong>15 minutes</strong>.<br>
          If you did not request a password reset, you can safely ignore this email. Your account remains completely secure.
        </div>
        <div class="link-fallback">
          Button not working? Copy and paste this secure link into your browser:<br>
          <a href="${resetLink}">${resetLink}</a>
        </div>
        <div class="signature">
          Warm regards,<br>
          <strong>The ApnaTrip Security Team</strong>
        </div>
      </div>
      <div class="footer">
        This is an automated security communication. Please do not reply.<br>
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Password Reset Confirmation Email (Password Changed Successfully)
   */
  public async sendPasswordResetSuccessEmail(
    to: string,
    recipientName: string,
    portalType: string = 'traveler'
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[ApnaTrip] Security Alert: Your Password Was Successfully Updated`;
    const brandColor = portalType === 'agency' ? '#583BE8' : '#FF4D6D';
    const portalName = portalType === 'agency' ? 'Agency Portal' : 'Traveler Account';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Changed Successfully</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: ${brandColor}; padding: 32px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .success-badge { display: inline-block; background-color: #ECFDF5; color: #059669; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 20px; border: 1px solid #A7F3D0; margin-bottom: 20px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .security-alert { background-color: #FEF2F2; border-radius: 12px; border: 1px solid #FECACA; padding: 16px 20px; font-size: 13px; color: #991B1B; line-height: 1.5; margin-bottom: 24px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <div class="success-badge">✓ Security Update Confirmed</div>
        <h2 class="title">Password Reset Complete</h2>
        <p class="message">
          Hello ${recipientName || 'Valued User'},<br><br>
          This is an automated confirmation that the password for your ${portalName} (${to}) was changed on <strong>${new Date().toUTCString()}</strong>.
        </p>
        <div class="security-alert">
          🚨 <strong>Did not make this change?</strong><br>
          If you did not authorize this password reset, please contact our 24/7 Security Operations team immediately at <a href="mailto:security@apnatrip.com" style="color: #991B1B; font-weight: 700;">security@apnatrip.com</a> to secure your account.
        </div>
        <p class="message" style="margin-bottom: 0;">
          All previous active login sessions have been terminated for your protection. You can now log in securely with your new password.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Customer Welcome Email
   */
  public async sendWelcomeEmail(to: string, userName: string): Promise<nodemailer.SentMessageInfo> {
    const subject = `Welcome to ApnaTrip, ${userName}! 🌍 Let Your Journey Begin`;
    const exploreUrl = `${envConfig.FRONTEND_URL || 'http://localhost:5173'}/explore`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to ApnaTrip</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #FF4D6D 0%, #E11D48 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 28px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .feature-list { background-color: #F8FAFC; border-radius: 14px; padding: 20px; margin-bottom: 28px; border: 1px solid #E2E8F0; }
    .feature-item { font-size: 13px; color: #334155; margin-bottom: 10px; line-height: 1.5; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #FF4D6D; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 36px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Welcome Aboard, ${userName}! 🎒</h2>
        <p class="message">
          We are thrilled to welcome you to ApnaTrip — your all-in-one travel ecosystem for curated tour departures, self-drive car rentals, and authentic local experiences.
        </p>
        <div class="feature-list">
          <div class="feature-item">✈️ <strong>Curated Tour Packages:</strong> Handcrafted itineraries by verified local destination operators.</div>
          <div class="feature-item">🚗 <strong>Self-Drive Car Rentals:</strong> Instant vehicle booking with token advance split-payments.</div>
          <div class="feature-item">🛡️ <strong>One-Time Identity Verification:</strong> Complete your KYC once and unlock Silver Tier membership privileges automatically!</div>
        </div>
        <div class="btn-container">
          <a href="${exploreUrl}" class="btn" target="_blank">Start Exploring Now</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Customer Email Verification Email
   */
  public async sendEmailVerificationEmail(
    to: string,
    recipientName: string,
    verificationLink: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[ApnaTrip] Please Verify Your Email Address`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Email Address</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #FF4D6D 0%, #E11D48 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 28px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #FF4D6D; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 40px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Verify Your Email Address</h2>
        <p class="message">
          Hello ${recipientName || 'Traveler'},<br><br>
          Thank you for signing up with ApnaTrip! Please verify your email address to activate your account and unlock booking capabilities.
        </p>
        <div class="btn-container">
          <a href="${verificationLink}" class="btn" target="_blank">Verify Email Address</a>
        </div>
        <p class="message" style="font-size: 12px; color: #64748B;">
          This verification link will remain valid for 24 hours. If you did not create an account with ApnaTrip, no further action is required.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Car Rental Provider Approval Email
   */
  public async sendCarRentalApprovedEmail(params: {
    to: string;
    ownerName: string;
    businessName: string;
    applicationId: string;
    loginLink: string;
    loginEmail: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, ownerName, businessName, applicationId, loginLink, loginEmail } = params;
    const subject = `🎉 Approved: Your Car Rental Fleet Provider Application (${applicationId})`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Car Rental Application Approved</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .credential-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #334155; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #10B981; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 36px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Commercial Fleet Approved! 🚗</h2>
        <p class="message">
          Dear ${ownerName || 'Partner'},<br><br>
          We are pleased to inform you that your Car Rental commercial provider registration for <strong>${businessName}</strong> (Tracking ID: <strong>${applicationId}</strong>) has been officially approved by the ApnaTrip Compliance Board.
        </p>
        <div class="credential-box">
          <strong>Portal Credentials:</strong><br>
          • <strong>Account Email:</strong> ${loginEmail}<br>
          • <strong>Status:</strong> ACTIVE (Commercial Fleet Ready)<br>
          • <strong>Workspace Route:</strong> /agency/car-rental/dashboard
        </div>
        <div class="btn-container">
          <a href="${loginLink}" class="btn" target="_blank">Access Fleet Dashboard</a>
        </div>
        <p class="message" style="font-size: 13px; color: #64748B;">
          You can now add vehicles to your fleet inventory, manage chauffeur rosters, review reservation requests, and manage financial payouts.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Car Rental Provider Rejection Email
   */
  public async sendCarRentalRejectedEmail(params: {
    to: string;
    ownerName: string;
    businessName: string;
    reason: string;
    appealLink?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, ownerName, businessName, reason, appealLink } = params;
    const subject = `Update Regarding Your Car Rental Provider Application - ApnaTrip`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Application Status Update</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .reason-box { background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #991B1B; line-height: 1.5; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Car Rental Application Status Update</h2>
        <p class="message">
          Dear ${ownerName || 'Partner'},<br><br>
          Thank you for your interest in joining the ApnaTrip Car Rental Partner Network with <strong>${businessName}</strong>. Following a comprehensive review by our compliance team, we are unable to approve your application at this time.
        </p>
        <div class="reason-box">
          <strong>Review Decision Reason:</strong><br>
          ${reason}
        </div>
        <p class="message">
          If you believe this decision was made in error or if you have rectified the compliance documentation mentioned above, you may reapply or reach out to partner support.
        </p>
        ${appealLink ? `<div style="text-align: center; margin: 24px 0;"><a href="${appealLink}" style="display: inline-block; background-color: #DC2626; color: #ffffff; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">Review Application</a></div>` : ''}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Booking Confirmation Email
   */
  public async sendBookingConfirmationEmail(params: {
    to: string;
    customerName: string;
    bookingId: string;
    title: string;
    travelDates: string;
    travelersCount: number;
    totalAmount: number;
    bookingDetailsUrl: string;
    thumbnail?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, customerName, bookingId, title, travelDates, travelersCount, totalAmount, bookingDetailsUrl } = params;
    const subject = `🎉 Booking Confirmed: ${title} (ID: ${bookingId})`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Booking Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .booking-card { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin-bottom: 28px; }
    .booking-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #334155; }
    .total-row { border-top: 1px solid #E2E8F0; padding-top: 12px; font-weight: 800; font-size: 16px; color: #0F172A; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #10B981; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 36px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">You're Going On An Adventure! 🎒</h2>
        <p class="message">
          Hello ${customerName || 'Traveler'},<br><br>
          Your reservation is confirmed! We have received your payment and notified the operations dispatch team.
        </p>
        <div class="booking-card">
          <div style="font-weight: 800; font-size: 16px; color: #0F172A; margin-bottom: 14px;">${title}</div>
          <div style="font-size: 13px; color: #64748B; margin-bottom: 8px;"><strong>Booking Reference:</strong> ${bookingId}</div>
          <div style="font-size: 13px; color: #64748B; margin-bottom: 8px;"><strong>Dates:</strong> ${travelDates}</div>
          <div style="font-size: 13px; color: #64748B; margin-bottom: 14px;"><strong>Travelers:</strong> ${travelersCount} Person(s)</div>
          <div style="border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 16px; font-weight: 800; color: #0F172A;">
            Total Paid: ₹${totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
        <div class="btn-container">
          <a href="${bookingDetailsUrl}" class="btn" target="_blank">View Booking Voucher</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Booking Cancellation Email
   */
  public async sendBookingCancelledEmail(params: {
    to: string;
    customerName: string;
    bookingId: string;
    title: string;
    refundAmount?: number;
    reason?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, customerName, bookingId, title, refundAmount, reason } = params;
    const subject = `Booking Cancellation Notice: ${title} (${bookingId})`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Booking Cancelled</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .box { background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #991B1B; line-height: 1.5; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Booking Cancellation Confirmed</h2>
        <p class="message">
          Hello ${customerName || 'Traveler'},<br><br>
          This email confirms that booking <strong>${bookingId}</strong> for <strong>${title}</strong> has been cancelled.
        </p>
        <div class="box">
          ${reason ? `<strong>Cancellation Reason:</strong> ${reason}<br>` : ''}
          ${refundAmount !== undefined ? `<strong>Refund Amount:</strong> ₹${refundAmount.toLocaleString('en-IN')}<br><small>Refunds typically reflect in your original payment account within 5–7 business days.</small>` : 'No refund applicable according to departure cancellation policies.'}
        </div>
        <p class="message">
          If you have any questions or require assistance, our customer support concierge is ready to assist you.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Payment Confirmation Receipt Email
   */
  public async sendPaymentConfirmationEmail(params: {
    to: string;
    customerName: string;
    paymentId: string;
    bookingId: string;
    amount: number;
    paymentMethod: string;
    receiptUrl?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, customerName, paymentId, bookingId, amount, paymentMethod, receiptUrl } = params;
    const subject = `Payment Receipt: ₹${amount.toLocaleString('en-IN')} Received (ID: ${paymentId})`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 32px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .receipt-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #334155; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Payment Confirmed</h2>
        <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
          Hello ${customerName || 'Traveler'},<br>
          Thank you for your payment. Here is your official receipt:
        </p>
        <div class="receipt-box">
          • <strong>Transaction ID:</strong> ${paymentId}<br>
          • <strong>Booking ID:</strong> ${bookingId}<br>
          • <strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}<br>
          • <strong>Payment Method:</strong> ${paymentMethod}<br>
          • <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        ${receiptUrl ? `<div style="text-align: center; margin: 24px 0;"><a href="${receiptUrl}" style="background-color: #10B981; color: #ffffff; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">Download Official Invoice</a></div>` : ''}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Payment Failure Notification Email
   */
  public async sendPaymentFailedEmail(params: {
    to: string;
    customerName: string;
    bookingId: string;
    amount: number;
    reason?: string;
    retryUrl?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, customerName, bookingId, amount, reason, retryUrl } = params;
    const subject = `⚠️ Payment Incomplete for Booking ${bookingId}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Failed</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 32px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .fail-box { background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #991B1B; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #EF4444; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 36px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Payment Unsuccessful</h2>
        <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
          Hello ${customerName || 'Traveler'},<br>
          We were unable to process your payment for booking <strong>${bookingId}</strong>.
        </p>
        <div class="fail-box">
          • <strong>Booking ID:</strong> ${bookingId}<br>
          • <strong>Attempted Amount:</strong> ₹${amount.toLocaleString('en-IN')}<br>
          • <strong>Status:</strong> Payment Failed / Cancelled<br>
          ${reason ? `• <strong>Details:</strong> ${reason}<br>` : ''}
        </div>
        <p style="font-size: 13px; color: #64748B;">
          Don't worry! Your seats are reserved temporarily. You can retry the payment right away to complete your reservation.
        </p>
        ${retryUrl ? `
        <div class="btn-container">
          <a href="${retryUrl}" class="btn" target="_blank">Retry Payment</a>
        </div>` : ''}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send KYC Approved & Membership Unlocked Notification Email
   */
  public async sendKycApprovedEmail(params: {
    to: string;
    travelerName: string;
    membershipTier: string;
    benefits?: string[];
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, travelerName, membershipTier, benefits } = params;
    const subject = `🎉 Identity Verified! Your ${membershipTier} Membership is Now Active`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KYC Approved</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .benefit-box { background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Verification Complete! 🛡️</h2>
        <p class="message">
          Hello ${travelerName || 'Traveler'},<br><br>
          Great news! Your identity documents have been successfully reviewed and approved by the ApnaTrip Compliance Board. Your travel profile is now 100% verified.
        </p>
        <div class="benefit-box">
          <div style="font-weight: 800; font-size: 15px; color: #065F46; margin-bottom: 10px;">
            Unlocked: ${membershipTier} Membership Tier
          </div>
          <div style="font-size: 13px; color: #047857; line-height: 1.6;">
            • <strong>5% Flat Discount</strong> on all curated package bookings<br>
            • <strong>1-Click Instant Checkout</strong> with pre-verified traveler profile<br>
            • <strong>Priority Concierge Support</strong> & trip dispatch assistance<br>
            • <strong>365 Days</strong> Tier Validity
          </div>
        </div>
        <p class="message" style="margin-bottom: 0;">
          The identity prompt on your home dashboard has been automatically dismissed. You're ready to explore without limitations!
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send KYC Rejected Notification Email
   */
  public async sendKycRejectedEmail(params: {
    to: string;
    travelerName: string;
    reason: string;
    reuploadUrl: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, travelerName, reason, reuploadUrl } = params;
    const subject = `Action Required: Travel Document Verification Update - ApnaTrip`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verification Update</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .reason-box { background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #991B1B; line-height: 1.5; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #DC2626; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 36px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">Verification Needs Attention</h2>
        <p class="message">
          Hello ${travelerName || 'Traveler'},<br><br>
          During the review of your uploaded identity documents, our compliance team identified an issue that requires your attention:
        </p>
        <div class="reason-box">
          <strong>Reviewer Feedback:</strong><br>
          ${reason}
        </div>
        <p class="message">
          Please upload a clear, legible photograph or scan of your document (Aadhaar Front+Back or Voter ID) so we can activate your travel profile.
        </p>
        <div class="btn-container">
          <a href="${reuploadUrl}" class="btn" target="_blank">Re-upload Documents</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Membership Tier Activation Email
   */
  public async sendMembershipActivatedEmail(params: {
    to: string;
    travelerName: string;
    tier: string;
    validityDays: number;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, travelerName, tier, validityDays } = params;
    const subject = `Welcome to ApnaTrip ${tier} Membership! ⭐`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Membership Activated</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.65; color: #475569; margin-bottom: 24px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 class="title">${tier} Status Active ⭐</h2>
        <p class="message">
          Hello ${travelerName || 'Traveler'},<br><br>
          Your account has been upgraded to <strong>${tier} Tier</strong>! Your membership is active for the next <strong>${validityDays} days</strong>.
        </p>
        <p class="message">
          Enjoy member-exclusive rates, priority seating, accelerated reward points, and VIP concierge assistance across all your future adventures.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send Promotional Coupon Notification Email
   */
  public async sendCouponNotificationEmail(params: {
    to: string;
    travelerName: string;
    couponCode: string;
    discountDesc: string;
    expiresAt: string;
    exploreUrl?: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const { to, travelerName, couponCode, discountDesc, expiresAt, exploreUrl } = params;
    const subject = `🎁 Special Gift: ${discountDesc} with code ${couponCode}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Special Travel Discount</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; text-align: center; }
    .coupon-card { border: 2px dashed #8B5CF6; background-color: #F5F3FF; border-radius: 16px; padding: 24px; margin: 24px 0; }
    .code { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #6D28D9; }
    .btn { display: inline-block; background-color: #8B5CF6; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 36px; border-radius: 14px; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 12px;">A Special Travel Reward Just For You! 🎁</h2>
        <p style="font-size: 14px; color: #475569; margin: 0 0 20px;">
          Hello ${travelerName || 'Traveler'}, treat yourself to your next dream destination with this exclusive promotion.
        </p>
        <div class="coupon-card">
          <div style="font-size: 14px; font-weight: 700; color: #6D28D9; margin-bottom: 8px;">${discountDesc}</div>
          <div class="code">${couponCode}</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 8px;">Valid until: ${expiresAt}</div>
        </div>
        ${exploreUrl ? `<div style="margin: 28px 0;"><a href="${exploreUrl}" class="btn" target="_blank">Book With Discount</a></div>` : ''}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send One-Time Password (OTP) Email
   */
  public async sendOtpEmail(
    to: string,
    userName: string,
    otp: string,
    purpose: string = 'Account Verification'
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = `[ApnaTrip] Your Verification Code: ${otp}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #F8F9FC; padding: 40px 0; }
    .container { max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: #FF4D6D; padding: 32px 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 36px 32px; text-align: center; }
    .otp-box { background-color: #FFF1F2; border: 2px solid #FECDD3; border-radius: 14px; padding: 18px 24px; display: inline-block; margin: 20px 0; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #E11D48; }
    .footer { border-top: 1px solid #F1F5F9; padding: 20px 32px; font-size: 11px; color: #94A3B8; text-align: center; background-color: #FAFBFC; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${getEmailLogoHtml(true)}
      </div>
      <div class="content">
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Verification Code</h2>
        <p style="font-size: 14px; color: #475569; margin: 0 0 16px;">
          Hello ${userName || 'Traveler'}, use the verification code below for ${purpose}:
        </p>
        <div class="otp-box">${otp}</div>
        <p style="font-size: 12px; color: #64748B; margin-top: 16px;">
          ⏱️ This code will expire in <strong>10 minutes</strong>. For your security, never share this code with anyone.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({ to, subject, html });
  }
}

export const mailService = new MailService();
