import mongoose from 'mongoose';
import { PackageModel } from '../src/models/package.model.js';
import { DepartureModel } from '../src/models/departure.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { AgencyModel } from '../src/models/agency.model.js';

const uri = 'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function migrateAndClean() {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB for Migration & Deduplication');

  // ==========================================
  // STEP 1: Consolidate Duplicate Packages
  // ==========================================
  console.log('\n--- Step 1: Auditing & Consolidating Duplicate Packages ---');
  const allPackages = await PackageModel.find({ isDeleted: false });

  // Group by agencyId and normalized title
  const packageGroups = new Map<string, typeof allPackages>();
  for (const pkg of allPackages) {
    // Normalize title: remove trailing " (Copy)" if it was auto-copied from identical name
    const normalizedTitle = pkg.title.replace(/\s*\(Copy\)\s*$/i, '').trim().toLowerCase();
    const aidStr = pkg.agencyId ? pkg.agencyId.toString() : 'NO_AGENCY';
    const key = `${aidStr}::${normalizedTitle}`;
    if (!packageGroups.has(key)) {
      packageGroups.set(key, []);
    }
    packageGroups.get(key)!.push(pkg);
  }

  for (const [key, pkgs] of packageGroups.entries()) {
    if (pkgs.length <= 1) continue;

    console.log(`\nFound ${pkgs.length} duplicate packages for: "${pkgs[0].title}"`);

    // Score and pick the best primary package to keep
    // Highest score: most bookings, has departures, is APPROVED/Active, oldest
    let bestPkg = pkgs[0];
    let bestScore = -1;

    for (const p of pkgs) {
      const depCount = await DepartureModel.countDocuments({ packageId: p._id });
      const bookCount = await BookingModel.countDocuments({ packageId: p._id });
      let score = bookCount * 100 + depCount * 10;
      if (p.status === 'APPROVED') score += 5;
      if (p.isActive) score += 5;
      if (!p.title.includes('(Copy)')) score += 20;

      if (score > bestScore) {
        bestScore = score;
        bestPkg = p;
      }
    }

    console.log(`-> Selected primary package to keep: [${bestPkg._id}] "${bestPkg.title}" (${bestPkg.packageId})`);

    const duplicates = pkgs.filter((p) => p._id.toString() !== bestPkg._id.toString());
    const duplicateIds = duplicates.map((d) => d._id);

    // 1. Re-link departures pointing to duplicate packages to primary package
    const depUpdateResult = await DepartureModel.updateMany(
      { packageId: { $in: duplicateIds } },
      { $set: { packageId: bestPkg._id } }
    );
    console.log(`   Re-linked ${depUpdateResult.modifiedCount} departures to primary package`);

    // 2. Re-link bookings pointing to duplicate packages to primary package
    const bookUpdateResult = await BookingModel.updateMany(
      { packageId: { $in: duplicateIds } },
      { $set: { packageId: bestPkg._id, packageName: bestPkg.title } }
    );
    console.log(`   Re-linked ${bookUpdateResult.modifiedCount} bookings to primary package`);

    // 3. Mark duplicate packages as deleted
    await PackageModel.updateMany(
      { _id: { $in: duplicateIds } },
      { $set: { isDeleted: true, status: 'REJECTED', isActive: false } }
    );
    console.log(`   Marked ${duplicates.length} duplicate packages as deleted`);

    // Ensure primary package has clean title and is approved
    if (bestPkg.title.includes('(Copy)')) {
      bestPkg.title = bestPkg.title.replace(/\s*\(Copy\)\s*$/i, '').trim();
    }
    bestPkg.status = 'APPROVED';
    bestPkg.isActive = true;
    await bestPkg.save();
  }

  // ==========================================
  // STEP 2: Consolidate Duplicate Departures
  // ==========================================
  console.log('\n--- Step 2: Auditing & Consolidating Duplicate Departures ---');
  const allDepartures = await DepartureModel.find({});

  // Group departures by agencyId + packageId + calendar date (YYYY-MM-DD)
  const departureGroups = new Map<string, typeof allDepartures>();
  for (const dep of allDepartures) {
    const dateStr = new Date(dep.departureDate).toISOString().split('T')[0];
    const key = `${dep.agencyId?.toString() || 'NO_AGENCY'}::${dep.packageId?.toString() || 'NO_PKG'}::${dateStr}`;
    if (!departureGroups.has(key)) {
      departureGroups.set(key, []);
    }
    departureGroups.get(key)!.push(dep);
  }

  for (const [key, deps] of departureGroups.entries()) {
    if (deps.length <= 1) continue;

    console.log(`\nFound ${deps.length} duplicate departures for: ${key}`);

    // Sort: most bookings first, then oldest
    let bestDep = deps[0];
    let maxBookings = -1;

    for (const d of deps) {
      const count = await BookingModel.countDocuments({ departureId: d._id });
      if (count > maxBookings) {
        maxBookings = count;
        bestDep = d;
      }
    }

    console.log(`-> Kept departure: [${bestDep._id}] ${bestDep.departureId} (${new Date(bestDep.departureDate).toLocaleDateString('en-IN')})`);

    const dupes = deps.filter((d) => d._id.toString() !== bestDep._id.toString());
    for (const dup of dupes) {
      // Re-point any bookings on duplicate to kept departure
      const moved = await BookingModel.updateMany(
        { departureId: dup._id },
        { $set: { departureId: bestDep._id } }
      );
      if (moved.modifiedCount > 0) {
        console.log(`   Transferred ${moved.modifiedCount} bookings from [${dup._id}] to [${bestDep._id}]`);
      }

      // Delete the duplicate departure
      await DepartureModel.deleteOne({ _id: dup._id });
      console.log(`   Deleted duplicate departure [${dup._id}] (${dup.departureId})`);
    }
  }

  // ==========================================
  // STEP 3: Recalculate Departures BookedSeats
  // ==========================================
  console.log('\n--- Step 3: Recalculating Booked Seats on All Departures ---');
  const remainingDepartures = await DepartureModel.find({});
  for (const dep of remainingDepartures) {
    const bookings = await BookingModel.find({
      departureId: dep._id,
      status: { $ne: 'CANCELLED' },
    });
    const totalBookedSeats = bookings.reduce((sum, b) => sum + (b.travelersCount || 1), 0);
    dep.bookedSeats = totalBookedSeats;
    if (dep.bookedSeats >= dep.capacity && dep.status === 'OPEN') {
      dep.status = 'SOLDOUT';
    } else if (dep.bookedSeats < dep.capacity && dep.status === 'SOLDOUT') {
      dep.status = 'OPEN';
    }
    await dep.save();
    console.log(`- Dep [${dep.departureId}]: ${totalBookedSeats} / ${dep.capacity} seats booked (status: ${dep.status})`);
  }

  // ==========================================
  // STEP 4: Recalculate Live Package Bookings Count
  // ==========================================
  console.log('\n--- Step 4: Recalculating Bookings Count on All Packages ---');
  const activePackages = await PackageModel.find({ isDeleted: false });
  for (const pkg of activePackages) {
    const totalBookings = await BookingModel.countDocuments({
      packageId: pkg._id,
      status: { $ne: 'CANCELLED' },
    });
    pkg.bookingsCount = totalBookings;
    await pkg.save();
    console.log(`- Pkg "${pkg.title}" (${pkg.packageId}): ${totalBookings} total bookings`);
  }

  // ==========================================
  // STEP 5: Create Database Unique Index
  // ==========================================
  console.log('\n--- Step 5: Enforcing Unique Index in MongoDB ---');
  try {
    await DepartureModel.collection.createIndex(
      { agencyId: 1, packageId: 1, departureDate: 1 },
      { unique: true, name: 'unique_agency_package_departure_date' }
    );
    console.log('✅ Unique index { agencyId: 1, packageId: 1, departureDate: 1 } created successfully in MongoDB!');
  } catch (err: any) {
    console.warn('Index notice:', err.message);
  }

  console.log('\n🎉 ALL DUPLICATES RESOLVED & CONSOLIDATED SUCCESSFULLY!\n');
  await mongoose.disconnect();
}

migrateAndClean().catch(console.error);
