import mongoose from 'mongoose';

const uri = 'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function testAtlas() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas! Ready state:', conn.connection.readyState);
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('Collections count:', collections.length);
      console.log('Collections:', collections.map(c => c.name));
    }
    await mongoose.disconnect();
    console.log('Disconnected gracefully.');
  } catch (err: any) {
    console.error('❌ Connection Failed:', err.message);
  }
}

testAtlas();
