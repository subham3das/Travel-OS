import nodemailer from 'nodemailer';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

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
   * Generic Send Email Method
   */
  public async sendMail(options: SendEmailOptions): Promise<nodemailer.SentMessageInfo> {
    if (!this.transporter) {
      this.initializeTransporter();
    }

    if (!this.transporter) {
      throw new Error('Email transporter is not available. Please verify SMTP configuration.');
    }

    const fromAddress = `"${envConfig.EMAIL_FROM_NAME}" <${envConfig.EMAIL_FROM_ADDRESS}>`;

    const mailOptions = {
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
      html: options.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info('✉️ Email delivered successfully to %s [Message ID: %s]', options.to, info.messageId);
      return info;
    } catch (error: any) {
      logger.error('❌ SMTP Dispatch Error to %s: %s', options.to, error.message);
      throw error;
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
    const subject = `[TravelOS] Administrator Password Reset Request`;

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
        <h1 class="logo">TravelOS</h1>
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${recipientName || 'Administrator'},</h2>
        <p class="message">
          We received a request to reset the administrator password for your TravelOS account. Click the button below to create a new password.
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
        &copy; ${new Date().getFullYear()} TravelOS Platform Inc. All rights reserved.<br>
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
        <h1 class="logo">ApnaTrip</h1>
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
    const subject = `Update Regarding Your Agency Application - TravelOS`;

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
        <h1 class="logo">ApnaTrip • TravelOS</h1>
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
        <h1 class="logo">ApnaTrip • TravelOS</h1>
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
    const subject = `Application Received: ${agencyName} [${applicationId}] — ApnaTrip TravelOS`;

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
        <h1 class="logo">ApnaTrip • TravelOS</h1>
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
        <h1 class="logo">Super Admin Security Alert</h1>
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
        <h1 class="logo">Document Re-upload Required</h1>
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
        <h1 class="logo">Agency Update Alert</h1>
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
        <h1 class="logo">ApnaTrip</h1>
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
}

export const mailService = new MailService();



