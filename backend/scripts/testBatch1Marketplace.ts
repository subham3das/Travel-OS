import { dbConnection } from '../src/config/db.config.js';
import { packageService } from '../src/services/package.service.js';
import { publicAgencyService } from '../src/services/publicAgency.service.js';
import { searchService } from '../src/services/search.service.js';

async function run() {
  console.log('🧪 Starting Batch 1: Public Marketplace Verification Suite...');
  await dbConnection.connect();

  try {
    // 1. Test Packages List
    console.log('1️⃣ Testing packageService.getPackages()...');
    const packagesRes = await packageService.getPackages({ page: 1, limit: 5 });
    console.log(`   Found ${packagesRes.packages.length} packages (Total: ${packagesRes.pagination.total})`);
    if (packagesRes.packages.length === 0) {
      throw new Error('No packages found');
    }
    const samplePkg = packagesRes.packages[0];
    console.log(`   Sample Package: "${samplePkg.title}" (${samplePkg.price}, ${samplePkg.duration})`);
    console.log(`   Sample Package ID: ${samplePkg.id}, Destination: ${samplePkg.destinationName}`);

    // 2. Test Featured Packages
    console.log('2️⃣ Testing packageService.getFeaturedPackages()...');
    const featured = await packageService.getFeaturedPackages(4);
    console.log(`   Found ${featured.length} featured packages`);

    // 3. Test Get Package by ID
    console.log(`3️⃣ Testing packageService.getPackageById("${samplePkg.id}")...`);
    const singlePkg = await packageService.getPackageById(samplePkg.id);
    console.log(`   Loaded package: "${singlePkg.title}" with ${singlePkg.itinerary.length} itinerary days`);
    if (!singlePkg.title || !singlePkg.price) {
      throw new Error('Package formatting is invalid');
    }

    // 4. Test Public Agencies List
    console.log('4️⃣ Testing publicAgencyService.getAgencies()...');
    const agenciesRes = await publicAgencyService.getAgencies({ page: 1, limit: 5 });
    console.log(`   Found ${agenciesRes.agencies.length} agencies (Total: ${agenciesRes.pagination.total})`);
    if (agenciesRes.agencies.length === 0) {
      throw new Error('No agencies found');
    }
    const sampleAgency = agenciesRes.agencies[0];
    console.log(`   Sample Agency: "${sampleAgency.name}" (${sampleAgency.location}, rating: ${sampleAgency.rating})`);

    // 5. Test Get Agency by ID
    console.log(`5️⃣ Testing publicAgencyService.getAgencyById("${sampleAgency.id}")...`);
    const singleAgency = await publicAgencyService.getAgencyById(sampleAgency.id);
    console.log(`   Loaded agency: "${singleAgency.name}" with ${singleAgency.packages.length} packages`);

    // 6. Test Multi-entity Global Search
    console.log('6️⃣ Testing searchService.search()...');
    const searchRes = await searchService.search({ query: 'kashmir' });
    console.log(`   Search for "kashmir": ${searchRes.totalCount} results (${searchRes.packages.length} packages, ${searchRes.destinations.length} destinations, ${searchRes.agencies.length} agencies)`);

    console.log('\n✅ ALL BATCH 1 TESTS PASSED SUCCESSFULLY! 🚀');
  } catch (err: any) {
    console.error('❌ Batch 1 Verification Failed:', err.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
  }
}

run();
