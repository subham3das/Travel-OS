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

const SectionConfigurationModel = mongoose.model(
  'SectionConfiguration',
  new mongoose.Schema({}, { strict: false, collection: 'section_configurations' })
);

const res = await SectionConfigurationModel.updateMany(
  { type: 'package' },
  { $set: { minItems: 1 } }
);

console.log('Updated package section configs:', res);

const allConfigs = await SectionConfigurationModel.find({}).lean();
console.log('Current section configs:');
allConfigs.forEach(c => console.log(`- ${c.sectionId} (type: ${c.type}, minItems: ${c.minItems}, showOnHome: ${c.showOnHome}, showOnExplore: ${c.showOnExplore})`));

await mongoose.disconnect();
console.log('Done');
