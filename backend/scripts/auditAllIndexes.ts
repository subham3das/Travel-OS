import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intercept console.warn to capture mongoose duplicate index warnings
const warnings: string[] = [];
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
  if (msg.includes('Duplicate schema index') || msg.includes('Mongoose')) {
    warnings.push(msg);
  }
  originalWarn(...args);
};

async function audit() {
  const modelsDir = path.join(__dirname, '../src/models');
  const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.model.ts'));

  console.log(`Found ${files.length} model files in ${modelsDir}`);

  for (const file of files) {
    try {
      await import(pathToFileURL(path.join(modelsDir, file)).href);
    } catch (err: any) {
      console.error(`Error loading model ${file}:`, err.message);
    }
  }

  console.log('\n================ MONGOOSE WARNINGS DETECTED ================');
  if (warnings.length === 0) {
    console.log('No warnings detected on initial import.');
  } else {
    warnings.forEach(w => console.log('⚠️ ', w));
  }

  console.log('\n================ DETAILED MODEL INDEX AUDIT ================');
  const modelNames = mongoose.modelNames();
  const report: any = {};

  for (const name of modelNames) {
    const model = mongoose.model(name);
    const schema = model.schema;
    const schemaIndexes = schema.indexes();

    const pathIndexes: any[] = [];
    schema.eachPath((pathname, schematype: any) => {
      const opts = schematype.options;
      if (opts) {
        if (opts.index || opts.unique || opts.sparse) {
          pathIndexes.push({
            path: pathname,
            index: opts.index,
            unique: opts.unique,
            sparse: opts.sparse,
          });
        }
      }
    });

    const duplicates: string[] = [];
    const redundancies: string[] = [];

    // Check path-level indexes vs schema-level indexes
    const keyCounts = new Map<string, number>();
    for (const [fields] of schemaIndexes) {
      const keyStr = JSON.stringify(fields);
      keyCounts.set(keyStr, (keyCounts.get(keyStr) || 0) + 1);
    }

    for (const [keyStr, count] of keyCounts.entries()) {
      if (count > 1) {
        duplicates.push(`Duplicate index registered ${count} times on: ${keyStr}`);
      }
    }

    for (const pi of pathIndexes) {
      if (pi.unique && pi.index) {
        redundancies.push(`Path '${pi.path}' has BOTH unique: true and index: true`);
      }
    }

    report[name] = {
      collection: model.collection.collectionName,
      pathIndexes,
      totalRegisteredIndexes: schemaIndexes.length,
      schemaIndexes: schemaIndexes.map(([f, o]) => ({ fields: f, options: o || {} })),
      duplicates,
      redundancies,
    };
  }

  fs.writeFileSync(path.join(__dirname, 'audit_indexes.json'), JSON.stringify(report, null, 2));
  console.log(`Saved detailed audit for ${modelNames.length} models to audit_indexes.json`);

  let totalDupes = 0;
  for (const [mName, mData] of Object.entries<any>(report)) {
    if (mData.duplicates.length > 0 || mData.redundancies.length > 0) {
      console.log(`\nModel: ${mName} (${mData.collection})`);
      if (mData.duplicates.length > 0) {
        totalDupes += mData.duplicates.length;
        mData.duplicates.forEach((d: string) => console.log('  🚨 ' + d));
      }
      if (mData.redundancies.length > 0) {
        mData.redundancies.forEach((r: string) => console.log('  ⚠️ ' + r));
      }
    }
  }

  console.log(`\nTotal duplicate index definitions found: ${totalDupes}`);
  process.exit(0);
}

audit();
