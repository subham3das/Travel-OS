import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI found in .env');
  process.exit(1);
}

await mongoose.connect(uri);
console.log('Connected to MongoDB');

const PackageModel = mongoose.model(
  'Package',
  new mongoose.Schema({}, { strict: false, collection: 'packages' })
);

const packages = await PackageModel.find({ isDeleted: false }, { title: 1, packageId: 1, category: 1, adventureType: 1 }).lean();
console.log('Total non-deleted packages:', packages.length);
packages.forEach((p) => {
  console.log(`- [${p.packageId}] ${p.title} | Cat: ${p.category} | AdvType: ${p.adventureType}`);
});

await mongoose.disconnect();
