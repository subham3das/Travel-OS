import mongoose from 'mongoose';

async function testLocal() {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/travelos_db', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('✅ Local MongoDB is running! State:', conn.connection.readyState);
    await mongoose.disconnect();
  } catch (err: any) {
    console.log('Local MongoDB not running on 27017:', err.message);
  }
}

testLocal();
