import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI found in .env');
  process.exit(1);
}

await mongoose.connect(uri);
console.log('Connected to MongoDB for Adventure Type migration');

const PackageModel = mongoose.model(
  'Package',
  new mongoose.Schema({}, { strict: false, collection: 'packages' })
);

// 1. Set default 'General Adventure' for any package where adventureType is missing or null
const defaultResult = await PackageModel.updateMany(
  {
    $or: [
      { adventureType: { $exists: false } },
      { adventureType: null },
      { adventureType: '' }
    ]
  },
  {
    $set: { adventureType: 'General Adventure' }
  }
);
console.log(`Defaulted ${defaultResult.modifiedCount} packages to 'General Adventure'.`);

// 2. Classify existing sample packages based on their title/category so Discovery & Homepage showcase real content immediately
const kashmirTrek = await PackageModel.updateOne(
  { packageId: 'PKG-2026-0001' },
  { $set: { adventureType: 'Trekking' } }
);
if (kashmirTrek.matchedCount > 0) {
  console.log("Updated PKG-2026-0001 to 'Trekking'");
}

const himachalCamp = await PackageModel.updateOne(
  { packageId: 'PKG-2026-0011' },
  { $set: { adventureType: 'Camping' } }
);
if (himachalCamp.matchedCount > 0) {
  console.log("Updated PKG-2026-0011 to 'Camping'");
}

const ladakhTrip = await PackageModel.updateOne(
  { packageId: 'PKG-2026-0012' },
  { $set: { adventureType: 'Road Trip' } }
);
if (ladakhTrip.matchedCount > 0) {
  console.log("Updated PKG-2026-0012 to 'Road Trip'");
}

// 3. Build compound index on adventureType
try {
  await PackageModel.collection.createIndex(
    { adventureType: 1, status: 1, isActive: 1, isDeleted: 1 },
    { background: true }
  );
  console.log('Compound index on adventureType created successfully.');
} catch (idxErr) {
  console.warn('Index creation notice:', idxErr.message);
}

// 4. Verification
const allPackages = await PackageModel.find(
  { isDeleted: false },
  { packageId: 1, title: 1, category: 1, adventureType: 1 }
).lean();

console.log('\n--- Active Packages after Migration ---');
allPackages.forEach((p) => {
  console.log(`[${p.packageId}] ${p.title} -> Adventure Type: "${p.adventureType}"`);
});

await mongoose.disconnect();
console.log('\nMigration complete.');
