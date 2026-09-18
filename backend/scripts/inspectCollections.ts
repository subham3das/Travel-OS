import mongoose from 'mongoose';
import { PackageModel } from '../src/models/package.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { TripModel } from '../src/models/trip.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { UserModel } from '../src/models/user.model.js';
import { ReviewModel } from '../src/models/review.model.js';
import { NotificationModel } from '../src/models/notification.model.js';
import { CommunityPostModel } from '../src/models/communityPost.model.js';

const uri = 'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function inspect() {
  await mongoose.connect(uri);
  console.log('--- MONGODB DOCUMENT COUNTS ---');
  console.log('Packages:', await PackageModel.countDocuments());
  console.log('Agencies:', await AgencyModel.countDocuments());
  console.log('Trips:', await TripModel.countDocuments());
  console.log('Bookings:', await BookingModel.countDocuments());
  console.log('Users:', await UserModel.countDocuments());
  console.log('Reviews:', await ReviewModel.countDocuments());
  console.log('Notifications:', await NotificationModel.countDocuments());
  console.log('Community Posts:', await CommunityPostModel.countDocuments());

  const samplePackage = await PackageModel.findOne({}).lean();
  console.log('\nSample Package:', samplePackage ? { id: samplePackage.packageId, title: samplePackage.title, price: samplePackage.price } : 'None');

  const sampleAgency = await AgencyModel.findOne({}).lean();
  console.log('Sample Agency:', sampleAgency ? { id: sampleAgency.agencyId || sampleAgency._id, name: sampleAgency.name || sampleAgency.agencyName } : 'None');

  await mongoose.disconnect();
}

inspect();
