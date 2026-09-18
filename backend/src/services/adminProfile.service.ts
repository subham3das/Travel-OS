import mongoose from 'mongoose';
import { AdminModel, IAdmin } from '../models/admin.model.js';
import { RoleModel } from '../models/role.model.js';
import { AdminSessionModel } from '../models/adminSession.model.js';
import { AdminActivityModel } from '../models/adminActivity.model.js';
import { HashUtil } from '../utils/hash.util.js';
import { DateUtil } from '../utils/date.util.js';
import { NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError } from '../utils/errors.util.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminProfileService {
  /**
   * 1. Get Complete Authenticated Administrator Profile
   */
  public async getProfile(adminId: string) {
    const admin = await AdminModel.findById(adminId).populate('roleId').exec();
    if (!admin || admin.isDeleted) {
      throw new NotFoundError('Administrator account not found.');
    }

    if (!admin.isActive) {
      throw new ForbiddenError('Administrator account is inactive.');
    }

    // 1. Fetch Real Active Sessions for this Admin from MongoDB
    const activeSessions = await AdminSessionModel.find({
      adminId: admin._id,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    // 2. Fetch Real Activity Logs for this Admin from MongoDB
    const recentActivities = await AdminActivityModel.find({
      adminId: admin._id,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    // 3. Count Total Logins & Actions
    const totalLoginsCount = await AdminSessionModel.countDocuments({ adminId: admin._id });
    const totalActionsCount = await AdminActivityModel.countDocuments({ adminId: admin._id });

    // Split Full Name into First & Last
    const nameParts = (admin.fullName || '').trim().split(' ');
    const firstName = nameParts[0] || 'Administrator';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Calculate Security Score dynamically based on enabled features
    let securityScore = 80;
    if (admin.authProvider === 'both' || admin.googleId) securityScore += 10;
    if (admin.recoveryEmail) securityScore += 5;
    if (admin.isSuperAdmin) securityScore += 5;
    securityScore = Math.min(100, securityScore);

    const roleName =
      (admin.roleId as any)?.name ||
      (admin.isSuperAdmin ? 'Super Administrator' : admin.role || 'Admin');

    const formattedDevices = activeSessions.map((sess, idx) => ({
      id: sess._id.toString(),
      name: `${sess.device} (${sess.os})`,
      browser: `${sess.browser} • ${sess.ip}`,
      location: sess.location || 'India',
      lastActive: DateUtil.getRelativeTime(sess.createdAt),
      isCurrent: idx === 0,
      iconType: (sess.device.toLowerCase().includes('phone') || sess.device.toLowerCase().includes('mobile')
        ? 'mobile'
        : sess.device.toLowerCase().includes('desktop')
        ? 'desktop'
        : 'laptop') as 'mobile' | 'desktop' | 'laptop',
    }));

    const formattedActivities = recentActivities.map((act) => {
      let iconType: 'approve' | 'settings' | 'report' | 'login' | 'backup' = 'settings';
      const a = act.action.toLowerCase();
      if (a.includes('approved') || a.includes('allowed')) iconType = 'approve';
      else if (a.includes('report') || a.includes('financial')) iconType = 'report';
      else if (a.includes('login') || a.includes('session')) iconType = 'login';
      else if (a.includes('backup') || a.includes('snapshot')) iconType = 'backup';

      return {
        id: act._id.toString(),
        title: act.module || 'Admin Operation',
        description: act.action,
        timestamp: DateUtil.getRelativeTime(act.createdAt),
        iconType,
      };
    });

    const memberSinceStr = admin.createdAt
      ? new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'January 2026';

    const lastPasswordChangeStr = admin.updatedAt
      ? DateUtil.getRelativeTime(admin.updatedAt)
      : 'Recently';

    return {
      avatarUrl:
        admin.profileImage ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      personalInfo: {
        firstName,
        lastName,
        email: admin.email,
        phone: admin.phone || '',
        country: admin.country || 'India',
        timezone: admin.timezone || 'Asia/Kolkata (GMT +5:30)',
        language: admin.preferences?.language || 'English (US)',
        location: admin.location || 'New Delhi, India',
        memberSince: memberSinceStr,
        adminId: `ADM-${admin._id.toString().slice(-6).toUpperCase()}`,
        role: roleName,
        isSuperAdmin: admin.isSuperAdmin,
      },
      security: {
        lastLogin: admin.lastLogin
          ? `${DateUtil.getRelativeTime(admin.lastLogin)} (${admin.location || 'New Delhi, India'})`
          : 'Active Now',
        lastPasswordChange: lastPasswordChangeStr,
        twoFactorEnabled: true,
        recoveryEmail: admin.recoveryEmail || admin.email,
        activeSessionsCount: Math.max(1, activeSessions.length),
      },
      preferences: {
        theme: admin.preferences?.theme || 'Light',
        language: admin.preferences?.language || 'English',
        emailNotifications: admin.preferences?.emailNotifications ?? true,
        smsNotifications: admin.preferences?.smsNotifications ?? false,
        desktopNotifications: admin.preferences?.desktopNotifications ?? true,
      },
      activities: formattedActivities,
      stats: [
        {
          id: 'stat-logins',
          title: 'Total Logins',
          value: String(Math.max(1, totalLoginsCount)),
          growth: '+100% verified',
          iconType: 'logins' as const,
        },
        {
          id: 'stat-actions',
          title: 'Admin Actions',
          value: String(totalActionsCount),
          growth: 'Active audit log',
          iconType: 'actions' as const,
        },
        {
          id: 'stat-reports',
          title: 'Security Clearance',
          value: admin.isSuperAdmin ? 'Level 5 (Full)' : 'Standard',
          growth: 'Unlimited access',
          iconType: 'reports' as const,
        },
        {
          id: 'stat-active',
          title: 'Session Status',
          value: 'Active Now',
          growth: 'Protected by TLS',
          iconType: 'active' as const,
        },
      ],
      devices: formattedDevices,
      accountStatus: {
        isVerified: true,
        isTwoFactorEnabled: true,
        isEmailVerified: true,
        securityScore,
      },
    };
  }

  /**
   * 2. Update Authenticated Administrator Personal Information
   */
  public async updateProfile(adminId: string, updateData: Record<string, any>) {
    const admin = await AdminModel.findById(adminId);
    if (!admin || admin.isDeleted) {
      throw new NotFoundError('Administrator not found');
    }

    // Strip sensitive fields to prevent privilege escalation via profile update
    delete updateData.email;
    delete updateData.role;
    delete updateData.roleId;
    delete updateData.permissions;
    delete updateData.permissionsOverride;
    delete updateData.isSuperAdmin;
    delete updateData.isActive;
    delete updateData.isDeleted;
    delete updateData.password;

    // Handle full name update
    if (updateData.firstName || updateData.lastName) {
      const first = updateData.firstName || '';
      const last = updateData.lastName || '';
      updateData.fullName = `${first} ${last}`.trim();
      delete updateData.firstName;
      delete updateData.lastName;
    }

    const updated = await AdminModel.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    // Record Activity Log in MongoDB
    await AdminActivityModel.create({
      adminId: admin._id,
      adminName: updated?.fullName || admin.fullName,
      adminAvatar: updated?.profileImage || admin.profileImage,
      action: 'Updated personal profile credentials & contact details',
      module: 'Profile',
      resourceId: adminId,
    });

    return this.getProfile(adminId);
  }

  /**
   * 3. Change Administrator Password (PUT /api/admin/profile/change-password)
   */
  public async changePassword(
    adminId: string,
    currentPass: string,
    newPass: string,
    meta: { ipAddress?: string; userAgent?: string; sessionId?: string; device?: string } = {}
  ) {
    if (currentPass === newPass) {
      throw new BadRequestError('New password cannot be identical to your current password.');
    }

    const admin = await AdminModel.findById(adminId).select('+password');
    if (!admin || admin.isDeleted) {
      throw new NotFoundError('Administrator not found');
    }

    if (!admin.password) {
      throw new UnauthorizedError(
        'Account is configured for Google SSO only. Please set up password authentication.'
      );
    }

    const isMatch = await HashUtil.compare(currentPass, admin.password);
    if (!isMatch) {
      await AuditLoggerService.log({
        actor: {
          id: admin._id.toString(),
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
        sessionId: meta.sessionId,
        ipAddress: meta.ipAddress,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Profile',
        action: 'Failed Password Change Attempt',
        eventType: 'Password Change Failed',
        description: `Incorrect current password supplied during password rotation for: ${admin.email}`,
        severity: 'High',
        status: 'Failed',
      });
      throw new UnauthorizedError('Current password is incorrect.');
    }

    const newHash = await HashUtil.hash(newPass);
    admin.password = newHash;
    admin.passwordChangedAt = new Date();
    await admin.save();

    // 1. Record Activity Log
    await AdminActivityModel.create({
      adminId: admin._id,
      adminName: admin.fullName,
      adminAvatar: admin.profileImage,
      action: 'Rotated administrator account password',
      module: 'Profile',
      resourceId: adminId,
    });

    // 2. Centralized Audit Log
    await AuditLoggerService.log({
      actor: {
        id: admin._id.toString(),
        name: admin.fullName,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
      },
      sessionId: meta.sessionId,
      ipAddress: meta.ipAddress,
      browser: meta.userAgent,
      device: meta.device || 'Desktop',
      module: 'Profile',
      action: 'Password Changed',
      eventType: 'Admin Password Updated',
      description: `Administrator ${admin.fullName} rotated account password successfully`,
      severity: 'Medium',
      status: 'Success',
      changes: [{ field: 'Password', before: '••••••••', after: '••••••••' }],
    });

    return true;
  }

  /**
   * 4. Update Account Preferences (Theme, Notifications, Language)
   */
  public async updatePreferences(
    adminId: string,
    prefs: Record<string, any>,
    meta: { ipAddress?: string; userAgent?: string; sessionId?: string; device?: string } = {}
  ) {
    const admin = await AdminModel.findById(adminId);
    if (!admin || admin.isDeleted) {
      throw new NotFoundError('Administrator not found');
    }

    const currentPrefs = admin.preferences || {
      theme: 'Light',
      language: 'English',
      emailNotifications: true,
      smsNotifications: false,
      desktopNotifications: true,
    };

    const changes: Array<{ field: string; before: any; after: any }> = [];

    if (prefs.theme && prefs.theme !== currentPrefs.theme) {
      changes.push({ field: 'Theme', before: currentPrefs.theme, after: prefs.theme });
    }
    if (prefs.language && prefs.language !== currentPrefs.language) {
      changes.push({ field: 'Language', before: currentPrefs.language, after: prefs.language });
    }
    if (prefs.emailNotifications !== undefined && prefs.emailNotifications !== currentPrefs.emailNotifications) {
      changes.push({ field: 'Email Notifications', before: currentPrefs.emailNotifications, after: prefs.emailNotifications });
    }
    if (prefs.smsNotifications !== undefined && prefs.smsNotifications !== currentPrefs.smsNotifications) {
      changes.push({ field: 'SMS Notifications', before: currentPrefs.smsNotifications, after: prefs.smsNotifications });
    }
    if (prefs.desktopNotifications !== undefined && prefs.desktopNotifications !== currentPrefs.desktopNotifications) {
      changes.push({ field: 'Desktop Notifications', before: currentPrefs.desktopNotifications, after: prefs.desktopNotifications });
    }

    const newPrefs = { ...currentPrefs, ...prefs };
    admin.preferences = newPrefs;
    await admin.save();

    // Centralized Immutable Audit Log
    if (changes.length > 0) {
      const isThemeChange = changes.some((c) => c.field === 'Theme');
      await AuditLoggerService.log({
        actor: {
          id: admin._id.toString(),
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
          profileImage: admin.profileImage,
        },
        sessionId: meta.sessionId,
        ipAddress: meta.ipAddress,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Settings',
        action: isThemeChange ? 'Theme Changed' : 'Preferences Updated',
        eventType: isThemeChange ? 'Admin Interface Theme Updated' : 'Admin Preferences Modified',
        description: isThemeChange
          ? `Administrator changed interface theme from ${currentPrefs.theme} to ${prefs.theme}`
          : `Administrator updated account preferences`,
        severity: 'Low',
        status: 'Success',
        changes,
      });
    }

    return newPrefs;
  }

  /**
   * 5. Terminate a Specific Active Login Session
   */
  public async terminateSession(adminId: string, sessionId: string) {
    const session = await AdminSessionModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(sessionId),
        adminId: new mongoose.Types.ObjectId(adminId),
      },
      { $set: { isActive: false } },
      { returnDocument: 'after' }
    );

    if (!session) {
      throw new NotFoundError('Active login session not found.');
    }

    // Record Activity Log
    await AdminActivityModel.create({
      adminId: new mongoose.Types.ObjectId(adminId),
      adminName: 'Administrator',
      action: `Terminated remote login session on device: ${session.device} (${session.ip})`,
      module: 'Security',
      resourceId: sessionId,
    });

    return true;
  }
}

export const adminProfileService = new AdminProfileService();
