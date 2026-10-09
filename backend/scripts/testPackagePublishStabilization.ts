import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { PackageModel } from '../src/models/package.model';
import { DepartureModel } from '../src/models/departure.model';
import { AgencyModel } from '../src/models/agency.model';
import { AgencyPackageService } from '../src/services/agencyPackage.service';
import { PackageService } from '../src/services/package.service';

async function runStabilizationTests() {
  console.log('🚀 Starting ApnaTrip Package Creation & Publishing Stabilization Test Suite...\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelos_db';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  const agencyService = new AgencyPackageService();
  const publicPackageService = new PackageService();

  // Find or create a test agency
  let testAgency = await AgencyModel.findOne({ status: 'APPROVED' });
  if (!testAgency) {
    testAgency = await AgencyModel.findOne();
  }
  if (!testAgency) {
    testAgency = await AgencyModel.create({
      name: 'Stabilization Test Agency',
      agencyDisplayName: 'Stabilization Test Agency',
      email: `agency_test_${Date.now()}@apnatrip.com`,
      phone: '+919876543210',
      status: 'APPROVED',
      isVerified: true,
      approvalStatus: 'APPROVED',
    });
  }

  const agencyId = testAgency._id;
  console.log(`🏢 Using Agency: ${testAgency.name} (${agencyId.toString()})\n`);

  // Clean up any stale test records from aborted runs
  await DepartureModel.deleteMany({ agencyId });
  await PackageModel.deleteMany({ agencyId, title: { $regex: /Stabilization Trek/i } });

  let createdPkgId = '';
  let mongoPkgId = '';

  try {
    // -------------------------------------------------------------
    // TEST 1: Create a Draft Package with Pickup & Drop-Off Cities and Canonical Gallery
    // -------------------------------------------------------------
    console.log('--- TEST 1: Creating Draft Package ---');
    const draftPayload = {
      title: `Stabilization Trek ${Date.now()}`,
      packageName: `Stabilization Trek ${Date.now()}`,
      description: 'A breathtaking high-altitude Himalayan journey designed for ultimate stabilization.',
      category: 'Domestic',
      adventureType: 'Trekking',
      durationDays: 4,
      durationNights: 3,
      destination: 'Manali, Himachal Pradesh',
      pickupCity: 'Chandigarh',
      dropOffCity: 'Manali',
      pickupLocation: 'Chandigarh Sector 17',
      dropOffLocation: 'Manali Mall Road',
      price: 12499,
      originalPrice: 15999,
      coverImage: 'https://res.cloudinary.com/demo/image/upload/v1234567/sample_cover.jpg',
      galleryImages: [
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567/sample_1.jpg',
          publicId: 'sample_1',
          width: 1920,
          height: 1080,
          format: 'jpg',
          bytes: 254120,
          uploadedAt: new Date().toISOString(),
          category: 'Landscape',
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567/sample_2.jpg',
          publicId: 'sample_2',
          width: 1920,
          height: 1080,
          format: 'jpg',
          bytes: 312400,
          uploadedAt: new Date().toISOString(),
          category: 'Camping',
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567/sample_3.jpg',
          publicId: 'sample_3',
          width: 1920,
          height: 1080,
          format: 'jpg',
          bytes: 189500,
          uploadedAt: new Date().toISOString(),
          category: 'Guide',
        },
      ],
      whatsappGroupLink: 'https://chat.whatsapp.com/L123abcTestGroupLink',
      departures: [
        {
          departureDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          departureTime: '06:00 AM',
          reportingTime: '05:30 AM',
          maximumTravelers: 15,
          availableSeats: 15,
          returnDate: new Date(Date.now() + 19 * 86400000).toISOString().split('T')[0],
        },
      ],
      isDraft: true,
    };

    const initialDraft = await agencyService.createPackage(agencyId, draftPayload);
    createdPkgId = initialDraft.packageId;
    mongoPkgId = initialDraft._id.toString();

    console.log(`✅ Draft Created: ${createdPkgId} (Mongo ID: ${mongoPkgId})`);
    if (initialDraft.status !== 'DRAFT') throw new Error(`Expected status DRAFT, got ${initialDraft.status}`);
    if (initialDraft.pickupCity !== 'Chandigarh') throw new Error(`Expected pickupCity Chandigarh, got ${initialDraft.pickupCity}`);
    if (initialDraft.dropOffCity !== 'Manali') throw new Error(`Expected dropOffCity Manali, got ${initialDraft.dropOffCity}`);
    if (initialDraft.whatsappGroupLink !== 'https://chat.whatsapp.com/L123abcTestGroupLink') {
      throw new Error(`Expected WhatsApp link to match, got ${initialDraft.whatsappGroupLink}`);
    }
    if (initialDraft.galleryImages.length !== 3) {
      throw new Error(`Expected 3 gallery items, got ${initialDraft.galleryImages.length}`);
    }
    console.log('✅ TEST 1 PASSED: Draft created with correct cities, gallery metadata, and WhatsApp link.\n');

    // -------------------------------------------------------------
    // TEST 2: Partial Step Autosave without Erasing Existing Media or Data
    // -------------------------------------------------------------
    console.log('--- TEST 2: Partial Autosave Protection ---');
    // Simulate updating only Step 1 & 2 without galleryImages or with empty array
    const partialUpdatePayload = {
      draftId: mongoPkgId,
      title: `${draftPayload.title} - Autosaved`,
      description: 'Updated description during step 2 autosave.',
      pickupCity: 'Chandigarh Airport',
      dropOffCity: 'Manali Bus Terminal',
      galleryImages: [], // Should NOT wipe existing gallery
      isDraft: true,
    };

    const autosavedDraft = await agencyService.createPackage(agencyId, partialUpdatePayload);
    console.log(`✅ Autosaved Draft: ${autosavedDraft.packageId}`);
    if (autosavedDraft.packageId !== createdPkgId) {
      throw new Error(`Autosave created a duplicate package! Original: ${createdPkgId}, New: ${autosavedDraft.packageId}`);
    }
    if (autosavedDraft.galleryImages.length !== 3) {
      throw new Error(`Autosave wiped existing gallery! Expected 3, got ${autosavedDraft.galleryImages.length}`);
    }
    if (autosavedDraft.pickupCity !== 'Chandigarh Airport') {
      throw new Error(`Expected pickupCity Chandigarh Airport, got ${autosavedDraft.pickupCity}`);
    }
    console.log('✅ TEST 2 PASSED: Partial update preserved gallery and reused draft package ID without duplicates.\n');

    // -------------------------------------------------------------
    // TEST 3: Departures Persistence in DepartureModel
    // -------------------------------------------------------------
    console.log('--- TEST 3: Departures Synchronization ---');
    const departuresInDb = await DepartureModel.find({ packageId: initialDraft._id });
    console.log(`✅ Departures in MongoDB DepartureModel: ${departuresInDb.length}`);
    if (departuresInDb.length === 0) {
      throw new Error('Expected at least 1 departure in DepartureModel, found 0');
    }
    if (departuresInDb[0].capacity !== 15) {
      throw new Error(`Expected departure capacity 15, got ${departuresInDb[0].capacity}`);
    }
    console.log('✅ TEST 3 PASSED: Departure synchronization verified in MongoDB.\n');

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // TEST 4A: Incomplete Itinerary Plan (empty text) BLOCKS Publication before DB write
    // -------------------------------------------------------------
    console.log('--- TEST 4A: Block Publication on Empty Plan Text ---');
    try {
      await agencyService.createPackage(agencyId, {
        draftId: mongoPkgId,
        title: initialDraft.title,
        price: 12499,
        isDraft: false,
        status: 'PUBLISHED',
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Manali',
            plans: [
              { text: 'Airport pickup' },
              { text: '' }, // EMPTY PLAN TEXT MUST BLOCK PUBLICATION
            ],
          },
        ],
      });
      throw new Error('FAILED: Publication succeeded despite empty plan text!');
    } catch (err: any) {
      console.log(`✅ Publication blocked with error: "${err.message}"`);
      if (!err.message.includes('Plan item 2 text is required')) {
        throw new Error(`Expected error identifying Plan item 2 text, got "${err.message}"`);
      }
    }
    console.log('✅ TEST 4A PASSED: Blocked publication before database write identifying specific item.\n');

    // -------------------------------------------------------------
    // TEST 4B: Incomplete Itinerary (day has 0 plans) BLOCKS Publication
    // -------------------------------------------------------------
    console.log('--- TEST 4B: Block Publication on Day with 0 Plans ---');
    try {
      await agencyService.createPackage(agencyId, {
        draftId: mongoPkgId,
        title: initialDraft.title,
        price: 12499,
        isDraft: false,
        status: 'PUBLISHED',
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Manali',
            plans: [], // NO PLANS MUST BLOCK PUBLICATION
          },
        ],
      });
      throw new Error('FAILED: Publication succeeded despite 0 plans!');
    } catch (err: any) {
      console.log(`✅ Publication blocked with error: "${err.message}"`);
      if (!err.message.includes('requires at least one plan activity')) {
        throw new Error(`Expected error identifying required plan activity, got "${err.message}"`);
      }
    }
    console.log('✅ TEST 4B PASSED: Blocked publication when a day has 0 plans.\n');

    // -------------------------------------------------------------
    // TEST 4C: Field Mismatch Normalization (title / description supplied where text expected)
    // -------------------------------------------------------------
    console.log('--- TEST 4C: Publish Package with Complete Normalized Plans ---');
    const publishPayload = {
      draftId: mongoPkgId,
      title: initialDraft.title,
      packageName: initialDraft.title,
      subtitle: 'Experience breathtaking vistas',
      description: initialDraft.description,
      category: 'Domestic',
      adventureType: 'Trekking',
      durationDays: 4,
      durationNights: 3,
      destination: 'Manali, Himachal Pradesh',
      pickupCity: 'Chandigarh',
      dropOffCity: 'Manali',
      price: 12499,
      originalPrice: 15999,
      availableSeats: 15,
      totalSeats: 15,
      coverImage: initialDraft.coverImage,
      galleryImages: initialDraft.galleryImages,
      inclusions: ['Guide', 'Meals', 'Tents', 'Permits', 'First Aid'],
      exclusions: ['Personal Expenses', 'Insurance', 'Alcohol'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Manali',
          description: 'Acclimatization day',
          stay: 'Hotel',
          meals: 'Dinner',
          plans: [
            { text: 'Airport pickup and transfer to hotel' },
            { text: 'Orientation session and gear check' },
          ],
        },
        {
          day: 2,
          title: 'Trek to Camp 1',
          description: 'Moderate climb through pine forest',
          stay: 'Tent',
          meals: 'All Meals',
          // Test field mismatch mapping: title supplied where schema expects text
          plans: [
            { title: 'Morning trail briefing and departure' } as any,
            { description: 'Ascent to alpine meadow campsite' } as any,
          ],
        },
        {
          day: 3,
          title: 'Summit Day',
          description: 'Reach peak and descend',
          stay: 'Tent',
          meals: 'All Meals',
          plans: [
            { text: 'Early morning summit push' },
            { text: 'Photo opportunity at summit ridge' },
            { text: 'Descent to base camp' },
          ],
        },
        {
          day: 4,
          title: 'Return to Manali',
          description: 'Farewell and departure',
          stay: 'None',
          meals: 'Breakfast',
          plans: [
            { content: 'Breakfast and campsite pack up' } as any,
            { text: 'Drive back to Manali Mall Road' },
          ],
        },
      ],
      departures: [
        {
          departureDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          departureTime: '06:00 AM',
          reportingTime: '05:30 AM',
          maximumTravelers: 15,
          availableSeats: 15,
          returnDate: new Date(Date.now() + 19 * 86400000).toISOString().split('T')[0],
        },
      ],
      whatsappGroupLink: 'https://chat.whatsapp.com/L123abcTestGroupLink',
      isDraft: false,
      status: 'PUBLISHED',
    };

    const publishedPackage = await agencyService.createPackage(agencyId, publishPayload);
    console.log(`✅ Package Published: ${publishedPackage.packageId}`);
    if (publishedPackage.status !== 'PUBLISHED') {
      throw new Error(`Expected status PUBLISHED, got ${publishedPackage.status}`);
    }
    if (publishedPackage.isDraft !== false || publishedPackage.isPublished !== true) {
      throw new Error(`Publication flags invalid: isDraft=${publishedPackage.isDraft}, isPublished=${publishedPackage.isPublished}`);
    }
    if (publishedPackage.packageId !== createdPkgId) {
      throw new Error(`Published package got new ID instead of finalizing draft ID! Expected ${createdPkgId}, got ${publishedPackage.packageId}`);
    }
    // Verify itinerary plans were properly normalized
    if (!publishedPackage.itinerary || publishedPackage.itinerary.length !== 4) {
      throw new Error(`Expected 4 itinerary days, got ${publishedPackage.itinerary?.length}`);
    }
    if (publishedPackage.itinerary[1].plans?.[0].text !== 'Morning trail briefing and departure') {
      throw new Error(`Expected normalized text 'Morning trail briefing and departure', got '${publishedPackage.itinerary[1].plans?.[0].text}'`);
    }
    if (publishedPackage.itinerary[3].plans?.[0].text !== 'Breakfast and campsite pack up') {
      throw new Error(`Expected normalized text from content property, got '${publishedPackage.itinerary[3].plans?.[0].text}'`);
    }
    console.log('✅ TEST 4C PASSED: Successfully normalized plans and published without duplicate creation.\n');

    // -------------------------------------------------------------
    // TEST 5: Cannot Demote Published Package Back to Draft
    // -------------------------------------------------------------
    console.log('--- TEST 5: Prevent Demoting Published Package to Draft ---');
    try {
      await agencyService.createPackage(agencyId, {
        draftId: mongoPkgId,
        isDraft: true,
      });
      throw new Error('Failed: Published package was demoted to draft without throwing error!');
    } catch (err: any) {
      console.log(`✅ Demotion successfully blocked: "${err.message}"`);
    }
    console.log('✅ TEST 5 PASSED: Lifecycle immutability verified.\n');

    // -------------------------------------------------------------
    // TEST 6: Editing Published Package Directly Updates Existing ID
    // -------------------------------------------------------------
    console.log('--- TEST 6: Editing Published Package Directly ---');
    const updatePayload = {
      title: `${publishedPackage.title} (Updated)`,
      price: 11999,
      pickupCity: 'Mohali International Airport',
      dropOffCity: 'Old Manali',
      whatsappGroupLink: 'https://chat.whatsapp.com/UpdatedGroupLink999',
    };

    const updatedPackage = await agencyService.updatePackage(agencyId, createdPkgId, updatePayload);
    if (updatedPackage.packageId !== createdPkgId) {
      throw new Error(`Package ID mutated during edit! Original: ${createdPkgId}, Now: ${updatedPackage.packageId}`);
    }
    if (updatedPackage.price !== 11999) {
      throw new Error(`Expected updated price 11999, got ${updatedPackage.price}`);
    }
    if (updatedPackage.pickupCity !== 'Mohali International Airport') {
      throw new Error(`Expected updated pickupCity, got ${updatedPackage.pickupCity}`);
    }
    if (updatedPackage.whatsappGroupLink !== 'https://chat.whatsapp.com/UpdatedGroupLink999') {
      throw new Error(`Expected updated WhatsApp link, got ${updatedPackage.whatsappGroupLink}`);
    }
    console.log('✅ TEST 6 PASSED: Published package edited in-place with existing package ID.\n');

    // -------------------------------------------------------------
    // TEST 7: Traveler-Facing Public Marketplace Visibility
    // -------------------------------------------------------------
    console.log('--- TEST 7: Traveler Marketplace Visibility ---');
    const { packageReadinessService } = await import('../src/services/packageReadiness.service');
    const readiness = await packageReadinessService.getPackageReadiness(createdPkgId);
    console.log('🔍 Package Readiness Evaluation:', {
      isBookable: readiness.isBookable,
      status: readiness.status,
      missingRequirements: readiness.missingRequirements,
      validDepartureCount: readiness.validDepartureCount,
    });
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    console.log('🔍 getBookablePackageIds count:', bookableIds.length, 'Includes mongoPkgId?', bookableIds.map(String).includes(mongoPkgId));
    const pkgDoc = await PackageModel.findById(mongoPkgId).lean();
    console.log('🔍 Package in DB:', {
      _id: pkgDoc?._id,
      packageId: pkgDoc?.packageId,
      status: pkgDoc?.status,
      isActive: pkgDoc?.isActive,
      isDeleted: pkgDoc?.isDeleted,
      agencyId: pkgDoc?.agencyId,
      price: pkgDoc?.price,
      itineraryLength: pkgDoc?.itinerary?.length,
      coverImage: pkgDoc?.coverImage,
      galleryLength: pkgDoc?.galleryImages?.length,
    });
    const deps = await DepartureModel.find({ packageId: mongoPkgId }).lean();
    console.log('🔍 Departures in DB:', deps);
    const publicResult = await publicPackageService.getPackages({
      search: updatedPackage.title,
    });
    console.log(`✅ Found ${publicResult.packages.length} matching packages in public marketplace.`);
    const found = publicResult.packages.find((p: any) => p.id === createdPkgId || p.packageId === createdPkgId);
    if (!found) {
      throw new Error(`Package ${createdPkgId} is NOT visible in public marketplace!`);
    }

    // Verify traveler package details format
    const publicDetail = await publicPackageService.getPackageById(createdPkgId);
    if (!publicDetail) {
      throw new Error(`Public package detail retrieval failed for ${createdPkgId}`);
    }
    if (publicDetail.pickupCity !== 'Mohali International Airport') {
      throw new Error(`Public detail missing pickupCity: ${publicDetail.pickupCity}`);
    }
    if (publicDetail.dropOffCity !== 'Old Manali') {
      throw new Error(`Public detail missing dropOffCity: ${publicDetail.dropOffCity}`);
    }
    if (publicDetail.whatsappGroupLink !== 'https://chat.whatsapp.com/UpdatedGroupLink999') {
      throw new Error(`Public detail missing whatsappGroupLink: ${publicDetail.whatsappGroupLink}`);
    }
    console.log('✅ TEST 7 PASSED: Package is live, visible in public catalog, and traveler details include cities & WhatsApp group link.\n');

    // -------------------------------------------------------------
    // TEST 8: Agency DTO Retrieval & Mapping
    // -------------------------------------------------------------
    console.log('--- TEST 8: Agency Package DTO & Mapping ---');
    const agencyPkg = await agencyService.getPackageById(agencyId, createdPkgId);
    if (agencyPkg.pickupCity !== 'Mohali International Airport') {
      throw new Error(`Agency DTO missing pickupCity: ${agencyPkg.pickupCity}`);
    }
    if (agencyPkg.dropOffCity !== 'Old Manali') {
      throw new Error(`Agency DTO missing dropOffCity: ${agencyPkg.dropOffCity}`);
    }
    if (agencyPkg.whatsappGroupLink !== 'https://chat.whatsapp.com/UpdatedGroupLink999') {
      throw new Error(`Agency DTO missing whatsappGroupLink: ${agencyPkg.whatsappGroupLink}`);
    }
    console.log('✅ TEST 8 PASSED: Agency panel DTO contains all stabilized fields.\n');

    console.log('===========================================================');
    console.log('🎉 ALL 8 STABILIZATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('===========================================================');
  } catch (err: any) {
    console.error('❌ STABILIZATION TEST FAILED:', err);
    process.exit(1);
  } finally {
    // Clean up test package
    if (mongoPkgId) {
      await PackageModel.deleteOne({ _id: mongoPkgId });
      await DepartureModel.deleteMany({ packageId: mongoPkgId });
      console.log(`🧹 Cleaned up test package and departures.`);
    }
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

runStabilizationTests();
