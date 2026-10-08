import mongoose from 'mongoose';
import { PackageModel } from '../src/models/package.model.js';
import { DepartureModel } from '../src/models/departure.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { AgencyModel } from '../src/models/agency.model.js';

const uri = 'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function audit() {
  await mongoose.connect(uri);
  console.log('Connected to DB');

  const packages = await PackageModel.find({ isDeleted: false }).lean();
  console.log(`\n=== PACKAGES IN DB (${packages.length} total) ===`);
  for (const p of packages) {
    const depCount = await DepartureModel.countDocuments({ packageId: p._id });
    const bookCount = await BookingModel.countDocuments({ packageId: p._id });
    console.log(`- [${p._id}] ID: ${p.packageId} | Title: "${p.title}" | Status: ${p.status} | Active: ${p.isActive} | Departures: ${depCount} | Bookings: ${bookCount}`);
  }

  const departures = await DepartureModel.find({}).populate('packageId', 'title').lean();
  console.log(`\n=== DEPARTURES IN DB (${departures.length} total) ===`);
  for (const d of departures) {
    const pkgTitle = (d.packageId as any)?.title || 'UNKNOWN PKG';
    const depDate = new Date(d.departureDate).toLocaleDateString('en-IN');
    const bookCount = await BookingModel.countDocuments({ departureId: d._id });
    console.log(`- [${d._id}] DepID: ${d.departureId} | Pkg: "${pkgTitle}" (${d.packageId?._id || d.packageId}) | Date: ${depDate} | Status: ${d.status} | BookedSeats: ${d.bookedSeats} | Bookings: ${bookCount}`);
  }

  await mongoose.disconnect();
}

audit().catch(console.error);
