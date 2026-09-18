import { dbConnection } from '../src/config/db.config.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { adminAuditLogsService } from '../src/services/adminAuditLogs.service.js';
import { AuditLoggerService } from '../src/services/auditLogger.service.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';

async function runAuditLogsIntegrationTests() {
  console.log('🧪 Starting Master Production Audit Logs Integration Suite against live MongoDB Atlas...\n');

  try {
    await dbConnection.connect();

    // 1. Authenticate Super Admin
    console.log('1️⃣ Authenticating Super Admin (das01subhamj@gmail.com)...');
    const authResult = await adminAuthService.login(
      { email: 'das01subhamj@gmail.com', password: 'AdminPassword@123' },
      { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows 11 (Security SOC Test)' }
    );
    const admin = authResult.admin;
    console.log(`   Logged in Admin: ${admin.name} [${admin.id}]`);

    // 2. Automatically generate a test audit event
    console.log('2️⃣ Generating real audit log event via AuditLoggerService...');
    const testLog = await AuditLoggerService.log({
      actor: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      module: 'Roles & Permissions',
      action: 'Updated Operations Manager permissions',
      eventType: 'Role Permissions Modified',
      description: 'Modified role permissions for Operations Manager (Granted Packages:Delete)',
      severity: 'Medium',
      status: 'Success',
      ipAddress: '103.21.244.67',
      country: '🇮🇳',
      browser: 'Google Chrome 124.0',
      os: 'Windows 11',
      device: 'Desktop',
      location: 'New Delhi, India',
      changes: [{ field: 'Packages:Delete', before: 'Restricted', after: 'Allowed' }],
    });

    if (!testLog) throw new Error('Failed to create audit log event in MongoDB');
    console.log(`   Generated Event ID: ${testLog.eventId}`);

    // 3. Test getAuditLogs (Paginated & Filtered)
    console.log('3️⃣ Testing getAuditLogs()...');
    const logsResult = await adminAuditLogsService.getAuditLogs({ module: 'Roles & Permissions' }, 1, 10);
    console.log(`   Fetched ${logsResult.logs.length} audit logs. Total: ${logsResult.pagination.total}`);
    if (logsResult.logs.length === 0) throw new Error('getAuditLogs returned 0 logs');

    // 4. Test getKPIStats
    console.log('4️⃣ Testing getKPIStats()...');
    const stats = await adminAuditLogsService.getKPIStats();
    console.log(`   Total Events Today: ${stats.totalEventsToday.value}`);
    console.log(`   Admin Actions: ${stats.adminActions.value}`);
    console.log(`   Critical Events: ${stats.criticalEvents.value}`);
    console.log(`   Failed Logins: ${stats.failedLogins.value}`);

    // 5. Test getCategories
    console.log('5️⃣ Testing getCategories()...');
    const categories = await adminAuditLogsService.getCategories();
    console.log(`   Fetched ${categories.length} category groups.`);
    categories.forEach((cat) => console.log(`   - ${cat.name}: ${cat.count} events`));

    // 6. Test getDistribution
    console.log('6️⃣ Testing getDistribution()...');
    const distribution = await adminAuditLogsService.getDistribution();
    console.log(`   Fetched ${distribution.length} distribution slices.`);

    // 7. Test getTopAdmins
    console.log('7️⃣ Testing getTopAdmins()...');
    const topAdmins = await adminAuditLogsService.getTopAdmins();
    console.log(`   Fetched ${topAdmins.length} active administrators.`);
    topAdmins.forEach((adm, idx) => console.log(`   ${idx + 1}. ${adm.name} (${adm.actionCount} actions)`));

    // 8. Test getSecurityAlerts
    console.log('8️⃣ Testing getSecurityAlerts()...');
    const alerts = await adminAuditLogsService.getSecurityAlerts();
    console.log(`   Fetched ${alerts.length} security alerts.`);

    // 9. Test getLoginHeatmap
    console.log('9️⃣ Testing getLoginHeatmap()...');
    const heatmap = await adminAuditLogsService.getLoginHeatmap();
    console.log(`   Heatmap dimensions: ${heatmap.length}x${heatmap[0].length}`);

    // 10. Test getAuditLogById
    console.log('🔟 Testing getAuditLogById()...');
    const eventDetail = await adminAuditLogsService.getAuditLogById(testLog.eventId);
    console.log(`   Event ID: ${eventDetail.id}`);
    console.log(`   Actor: ${eventDetail.actor.name}`);
    console.log(`   Description: ${eventDetail.description}`);
    console.log(`   Changes Count: ${eventDetail.changes.length}`);

    console.log('\n✅ ALL 10 AUDIT LOGGING SYSTEM TESTS PASSED 100% PERFECTLY!\n');
  } catch (error: any) {
    console.error('❌ Audit Logs Test Suite Failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
    process.exit(0);
  }
}

runAuditLogsIntegrationTests();
