import mongoose from 'mongoose';
import { CarModel } from '../src/models/car.model.js';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function populateCarRoutes() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const cars = await CarModel.find({});
    console.log(`Found ${cars.length} cars in database.`);

    for (const car of cars) {
      const brandModel = `${car.brand} ${car.name}`.toLowerCase();
      let routes = [];

      if (brandModel.includes('innova') || car.type === 'suv') {
        routes = [
          { pickup: 'Dibrugarh', destination: 'Tinsukia', price: 2600, status: 'active', estimatedDuration: '1h 15m', notes: 'Includes tolls & parking' },
          { pickup: 'Dibrugarh', destination: 'Naharkatia', price: 2100, status: 'active', estimatedDuration: '1h 45m', notes: 'Chauffeur included' },
          { pickup: 'Dibrugarh', destination: 'Moran', price: 1600, status: 'active', estimatedDuration: '1h 10m', notes: 'AC Cab service' },
          { pickup: 'Dibrugarh', destination: 'Guwahati', price: 9500, status: 'active', estimatedDuration: '9h 30m', notes: 'Outstation highway trip' },
          { pickup: 'Guwahati', destination: 'Shillong', price: 3500, status: 'active', estimatedDuration: '3h 00m', notes: 'Scenic hills route' },
        ];
      } else if (brandModel.includes('tempo') || car.type === 'tempo_traveller' || car.type === 'mini_bus') {
        routes = [
          { pickup: 'Dibrugarh', destination: 'Tinsukia', price: 4500, status: 'active', estimatedDuration: '1h 20m', notes: 'Spacious group travel' },
          { pickup: 'Dibrugarh', destination: 'Guwahati', price: 18500, status: 'active', estimatedDuration: '10h 00m', notes: 'Full AC luxury minibus' },
          { pickup: 'Guwahati', destination: 'Shillong', price: 6500, status: 'active', estimatedDuration: '3h 30m', notes: 'Group tour departure' },
        ];
      } else {
        routes = [
          { pickup: 'Dibrugarh', destination: 'Tinsukia', price: 1800, status: 'active', estimatedDuration: '1h 15m', notes: 'Sedan comfort, driver included' },
          { pickup: 'Dibrugarh', destination: 'Naharkatia', price: 1400, status: 'active', estimatedDuration: '1h 35m', notes: 'Clean AC vehicle' },
          { pickup: 'Dibrugarh', destination: 'Moran', price: 1000, status: 'active', estimatedDuration: '1h 00m', notes: 'Fixed transparent fare' },
          { pickup: 'Dibrugarh', destination: 'Guwahati', price: 8500, status: 'active', estimatedDuration: '9h 00m', notes: 'Highway sanitized cab' },
          { pickup: 'Guwahati', destination: 'Shillong', price: 2600, status: 'active', estimatedDuration: '2h 45m', notes: 'Popular route, AC verified' },
        ];
      }

      car.routes = routes as any;
      await car.save();
      console.log(`Updated car ${car.name} (${car._id}) with ${routes.length} fixed routes.`);
    }

    console.log('Successfully populated routes on all vehicles.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error populating routes:', err);
    process.exit(1);
  }
}

populateCarRoutes();
