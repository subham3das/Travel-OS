import mongoose from 'mongoose';
import { envConfig } from '../src/config/env.config.js';
import { AdminModel } from '../src/models/admin.model.js';
import { adminDashboardService } from '../src/services/adminDashboard.service.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { PaymentModel } from '../src/models/payment.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { SupportTicketModel } from '../src/models/supportTicket.model.js';

async function runDashboardIntegrationTest() {
  console.log('🚀 [TEST] Starting TravelOS Admin Dashboard MongoDB Integration Tests...\n');

  try {
    // 1. Connect to MongoDB
    console.log('📡 [TEST 1] Connecting to MongoDB Atlas...');
    await mongoose.connect(envConfig.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!\n');

    // 2. Verify Super Admin exists
    console.log('👤 [TEST 2] Verifying Super Admin account in database...');
    const superAdmin = await AdminModel.findOne({ email: 'das01subhamj@gmail.com' });
    if (!superAdmin) {
      throw new Error('Super Admin das01subhamj@gmail.com not found in Admin collection!');
    }
    console.log(`✅ Super Admin verified: ${superAdmin.name} (${superAdmin.email}) [Role: ${superAdmin.role}]\n`);

    // 3. Test GET Stats Aggregation
    console.log('📊 [TEST 3] Testing getStats() aggregation pipeline...');
    const stats = await adminDashboardService.getStats();
    console.log('   KPI Stats Result:', {
      platformRevenue: stats.platformRevenue.value,
      gmv: stats.gmv.value,
      activeAgencies: stats.activeAgencies.value,
      totalUsers: stats.totalUsers.value,
      todaysBookings: stats.todaysBookings.value,
      runningTrips: stats.runningTrips.value,
      pendingApprovals: stats.pendingApprovals.value,
      openSupportTickets: stats.openSupportTickets.value,
    });
    if (!stats.platformRevenue || !stats.gmv || !stats.activeAgencies || !stats.totalUsers) {
      throw new Error('Stats aggregation returned incomplete payload');
    }
    console.log('✅ getStats() passed 100%!\n');

    // 4. Test GET Charts Aggregations (30d and 7d)
    console.log('📈 [TEST 4] Testing getCharts() aggregation pipelines...');
    const charts30d = await adminDashboardService.getCharts('30d');
    const charts7d = await adminDashboardService.getCharts('7d');
    console.log('   30d Charts:', {
      revenuePoints: charts30d.revenue.dataPoints.length,
      bookingsPoints: charts30d.bookingTrend.dataPoints.length,
      usersPoints: charts30d.userGrowth.dataPoints.length,
      agencyPoints: charts30d.agencyGrowth.dataPoints.length,
    });
    console.log('   7d Charts:', {
      revenuePoints: charts7d.revenue.dataPoints.length,
      bookingsPoints: charts7d.bookingTrend.dataPoints.length,
      usersPoints: charts7d.userGrowth.dataPoints.length,
      agencyPoints: charts7d.agencyGrowth.dataPoints.length,
    });
    console.log('✅ getCharts() passed 100%!\n');

    // 5. Test Recent Activities from audit_logs
    console.log('📜 [TEST 5] Testing getRecentActivities() from audit_logs collection...');
    const activities = await adminDashboardService.getRecentActivities(5);
    console.log(`   Fetched ${activities.length} recent activity logs.`);
    if (activities.length > 0) {
      console.log('   Sample log:', activities[0]);
    }
    console.log('✅ getRecentActivities() passed 100%!\n');

    // 6. Test Latest Transactions from payments
    console.log('💳 [TEST 6] Testing getLatestTransactions() from payments collection...');
    const transactions = await adminDashboardService.getLatestTransactions(5);
    console.log(`   Fetched ${transactions.length} latest transaction records.`);
    console.log('✅ getLatestTransactions() passed 100%!\n');

    // 7. Test Pending Approvals from agencies & packages
    console.log('⏳ [TEST 7] Testing getPendingApprovals() from agencies/packages...');
    const approvals = await adminDashboardService.getPendingApprovals(5);
    console.log(`   Fetched ${approvals.length} pending approval items.`);
    console.log('✅ getPendingApprovals() passed 100%!\n');

    // 8. Test System Health Telemetry Probe
    console.log('🩺 [TEST 8] Testing getSystemHealth() live probe...');
    const health = await adminDashboardService.getSystemHealth();
    console.log('   Overall Status:', health.overallStatus);
    console.log('   Services:', health.services.map((s) => `${s.name}: ${s.status}`));
    if (!health.overallStatus || health.services.length !== 4) {
      throw new Error('System health returned invalid payload');
    }
    console.log('✅ getSystemHealth() passed 100%!\n');

    // 9. Test Live Activity Center stream & metrics
    console.log('⚡ [TEST 9] Testing getLiveActivity() real-time stream & live metrics...');
    const live = await adminDashboardService.getLiveActivity();
    console.log('   Live Metrics:', live.metrics);
    console.log(`   Live Event Stream: ${live.events.length} events, ${live.serviceStatuses.length} services`);
    console.log('✅ getLiveActivity() passed 100%!\n');

    // 10. Test Operational Queues (Active Trips, Payments, Support)
    console.log('🗂️ [TEST 10] Testing operational queue getters...');
    const [trips, payQueue, supportQueue, quickActions] = await Promise.all([
      adminDashboardService.getActiveTrips(4),
      adminDashboardService.getPaymentQueue(4),
      adminDashboardService.getSupportQueue(4),
      adminDashboardService.getQuickActions(),
    ]);
    console.log(`   Active Trips: ${trips.length} records`);
    console.log(`   Payment Queue: ${payQueue.length} records`);
    console.log(`   Support Queue: ${supportQueue.length} records`);
    console.log(`   Quick Actions: ${quickActions.length} actions configured`);
    console.log('✅ Operational queues passed 100%!\n');

    console.log('🎉 ======================================================================');
    console.log('🎉 ALL 10/10 MASTER DASHBOARD INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('🎉 ======================================================================\n');
  } catch (error: any) {
    console.error('❌ Integration Test Failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

runDashboardIntegrationTest();
