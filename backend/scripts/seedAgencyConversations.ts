import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { UserModel } from '../src/models/user.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { ConversationModel } from '../src/models/conversation.model.js';
import { MessageModel } from '../src/models/message.model.js';
import { SavedTravelerModel } from '../src/models/savedTraveler.model.js';
import { AgencyPrivateNoteModel } from '../src/models/agencyPrivateNote.model.js';
import { envConfig } from '../src/config/env.config.js';

async function seedAgencyConversations() {
  console.log('🚀 Seeding Real MongoDB Conversations for Agency Inbox...\n');

  try {
    const mongoUri = envConfig.MONGODB_URI || 'mongodb://localhost:27017/travel_os_dev';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // 1. Find or create an active approved agency (Alpha Himalayan Adventures)
    let agency = await AgencyModel.findOne({
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      isDeleted: false,
    });

    if (!agency) {
      agency = await AgencyModel.create({
        name: 'Himalayan Escape Travels',
        agencyDisplayName: 'Himalayan Escape',
        ownerName: 'Subham Das',
        email: 'agency@apnatrip.in',
        phone: '9876543210',
        applicationId: 'APP-SEED-001',
        verificationStatus: 'APPROVED',
        status: 'ACTIVE',
        owner: {
          name: 'Subham Das',
          email: 'agency@apnatrip.in',
          phone: '9876543210',
        },
      });
      console.log('🏢 Created Default Approved Agency:', agency.name, '(', agency._id.toString(), ')');
    } else {
      console.log('🏢 Using Existing Approved Agency:', agency.name, '(', agency._id.toString(), ')');
    }

    // Also get all other approved agencies
    const allAgencies = await AgencyModel.find({ isDeleted: false });

    // 2. Create Real Users (Travelers)
    const travelersData = [
      {
        fullName: 'Subham Das',
        email: 'subham.traveler@gmail.com',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        homeCity: 'Kolkata',
        gender: 'male' as const,
        dateOfBirth: new Date('1996-05-15'),
      },
      {
        fullName: 'Priya Sharma',
        email: 'priya.sharma99@gmail.com',
        phone: '+91 91234 56789',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        homeCity: 'Mumbai',
        gender: 'female' as const,
        dateOfBirth: new Date('1998-08-20'),
      },
      {
        fullName: 'Rahul Verma',
        email: 'rahul.verma@outlook.com',
        phone: '+91 99887 76655',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
        homeCity: 'Delhi NCR',
        gender: 'male' as const,
        dateOfBirth: new Date('1994-11-10'),
      },
      {
        fullName: 'Ananya Iyer',
        email: 'ananya.iyer@gmail.com',
        phone: '+91 90001 23456',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
        homeCity: 'Bangalore',
        gender: 'female' as const,
        dateOfBirth: new Date('1997-03-25'),
      },
      {
        fullName: 'Aman Gupta',
        email: 'aman.gupta@corp.com',
        phone: '+91 87654 32109',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        homeCity: 'Pune',
        gender: 'male' as const,
        dateOfBirth: new Date('1992-12-05'),
      },
    ];

    const users: any[] = [];
    for (const t of travelersData) {
      let user = await UserModel.findOne({ email: t.email });
      if (!user) {
        user = await UserModel.create({
          ...t,
          status: 'Active',
          isEmailVerified: true,
          authProvider: 'local',
          profileCompleted: true,
          onboardingCompleted: true,
        });
      }
      users.push(user);
    }
    console.log(`👥 Ensured ${users.length} Real Users in MongoDB.`);

    // 3. Create Real Bookings for Agency
    const now = new Date();
    const bookingsData = [
      {
        bookingId: 'BK-2024-00568',
        userId: users[0]._id,
        agencyId: agency._id,
        packageName: 'Ladakh Expedition 7D/6N',
        agencyName: agency.name,
        customerName: users[0].fullName,
        customerEmail: users[0].email,
        customerPhone: users[0].phone,
        travelersCount: 4,
        totalAmount: 64000,
        paidAmount: 64000,
        status: 'CONFIRMED' as const,
        paymentStatus: 'PAID' as const,
        destination: 'Leh Ladakh',
        tripStartDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days ahead
        tripEndDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-2025-01123',
        userId: users[1]._id,
        agencyId: agency._id,
        packageName: 'Meghalaya Backpacking 6D/5N',
        agencyName: agency.name,
        customerName: users[1].fullName,
        customerEmail: users[1].email,
        customerPhone: users[1].phone,
        travelersCount: 1,
        totalAmount: 28000,
        paidAmount: 28000,
        status: 'COMPLETED' as const,
        paymentStatus: 'PAID' as const,
        destination: 'Shillong & Cherrapunji',
        tripStartDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-2025-00987',
        userId: users[2]._id,
        agencyId: agency._id,
        packageName: 'Kashmir Valley Escape 6D/5N',
        agencyName: agency.name,
        customerName: users[2].fullName,
        customerEmail: users[2].email,
        customerPhone: users[2].phone,
        travelersCount: 2,
        totalAmount: 42000,
        paidAmount: 42000,
        status: 'CONFIRMED' as const,
        paymentStatus: 'PAID' as const,
        destination: 'Srinagar & Gulmarg',
        tripStartDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(now.getTime() + 36 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-2025-00765',
        userId: users[3]._id,
        agencyId: agency._id,
        packageName: 'Goa Coastal Retreat 4D/3N',
        agencyName: agency.name,
        customerName: users[3].fullName,
        customerEmail: users[3].email,
        customerPhone: users[3].phone,
        travelersCount: 1,
        totalAmount: 18500,
        paidAmount: 18500,
        status: 'CONFIRMED' as const,
        paymentStatus: 'PAID' as const,
        destination: 'North Goa',
        tripStartDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(now.getTime() + 49 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-2025-00432',
        userId: users[4]._id,
        agencyId: agency._id,
        packageName: 'Spiti Valley High Passes 7D/6N',
        agencyName: agency.name,
        customerName: users[4].fullName,
        customerEmail: users[4].email,
        customerPhone: users[4].phone,
        travelersCount: 2,
        totalAmount: 52000,
        paidAmount: 52000,
        status: 'COMPLETED' as const,
        paymentStatus: 'PAID' as const,
        destination: 'Kaza & Spiti',
        tripStartDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(now.getTime() - 53 * 24 * 60 * 60 * 1000),
      },
    ];

    const bookings: any[] = [];
    for (const b of bookingsData) {
      let booking = await BookingModel.findOne({ bookingId: b.bookingId });
      if (!booking) {
        booking = await BookingModel.create(b);
      } else {
        booking.agencyId = agency._id;
        await booking.save();
      }
      bookings.push(booking);
    }
    console.log(`📦 Ensured ${bookings.length} Real Bookings in MongoDB.`);

    // 4. Create Saved Travelers (Group Companions)
    await SavedTravelerModel.deleteMany({ userId: { $in: users.map((u) => u._id) } });

    await SavedTravelerModel.create([
      {
        userId: users[0]._id,
        fullName: 'Rahul Sharma',
        dob: new Date('1995-04-12'),
        gender: 'male',
        relationship: 'friend',
        nationality: 'Indian',
      },
      {
        userId: users[0]._id,
        fullName: 'Priya Sharma',
        dob: new Date('1997-09-08'),
        gender: 'female',
        relationship: 'spouse',
        nationality: 'Indian',
      },
      {
        userId: users[0]._id,
        fullName: 'Aman Das',
        dob: new Date('1999-01-22'),
        gender: 'male',
        relationship: 'sibling',
        nationality: 'Indian',
      },
      {
        userId: users[2]._id,
        fullName: 'Neha Verma',
        dob: new Date('1996-07-14'),
        gender: 'female',
        relationship: 'spouse',
        nationality: 'Indian',
      },
      {
        userId: users[4]._id,
        fullName: 'Rohan Gupta',
        dob: new Date('1994-03-30'),
        gender: 'male',
        relationship: 'sibling',
        nationality: 'Indian',
      },
    ]);
    console.log('👨‍👩‍👧‍👦 Ensured Saved Group Companions in MongoDB.');

    // 5. Seed Real Conversations & Messages for ALL Agencies (to ensure every logged in agency has data)
    for (const targetAgency of allAgencies) {
      console.log(`\n💬 Seeding Conversations for Agency: ${targetAgency.name} (${targetAgency._id})`);

      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        const b = bookings[i];

        let conv = await ConversationModel.findOne({
          agencyId: targetAgency._id,
          customerId: u._id,
        });

        if (!conv) {
          conv = await ConversationModel.create({
            agencyId: targetAgency._id,
            customerId: u._id,
            bookingId: b ? b._id : null,
            lastMessagePreview: 'Pickup location has been updated. Looking forward to the trip!',
            lastMessageAt: new Date(Date.now() - i * 3600 * 1000),
            lastSender: i % 2 === 0 ? 'customer' : 'agency',
            unreadAgencyCount: i === 0 ? 2 : i === 3 ? 1 : 0,
            unreadCustomerCount: 0,
            isArchived: false,
            isDeleted: false,
          });
        }

        // Clear existing messages for clean seed
        await MessageModel.deleteMany({ conversationId: conv._id });

        // Insert real messages stream
        const msgDocs = [
          {
            conversationId: conv._id,
            senderType: 'customer',
            senderId: u._id,
            receiverId: targetAgency._id,
            text: `Hello! Very excited for the trip starting soon.`,
            messageType: 'text',
            status: 'read',
            createdAt: new Date(Date.now() - 86400 * 1000),
          },
          {
            conversationId: conv._id,
            senderType: 'agency',
            senderId: targetAgency._id,
            receiverId: u._id,
            text: `Welcome ${u.fullName}! We are thrilled to host you. Here is the verified trip itinerary document.`,
            messageType: 'pdf',
            attachments: [
              {
                secureUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                publicId: 'sample_itinerary_pdf',
                fileName: `${b ? b.packageName.replace(/[\s/]+/g, '_') : 'Trip'}_Itinerary.pdf`,
                fileSize: '2.4 MB',
                mimeType: 'application/pdf',
                fileType: 'pdf',
                uploadedAt: new Date(Date.now() - 80000 * 1000),
              },
            ],
            status: 'read',
            createdAt: new Date(Date.now() - 80000 * 1000),
          },
          {
            conversationId: conv._id,
            senderType: 'customer',
            senderId: u._id,
            receiverId: targetAgency._id,
            text: `Thank you! Can you confirm if our seats in the vehicle are reserved together?`,
            messageType: 'text',
            status: 'read',
            createdAt: new Date(Date.now() - 40000 * 1000),
          },
          {
            conversationId: conv._id,
            senderType: 'agency',
            senderId: targetAgency._id,
            receiverId: u._id,
            text: `Yes absolutely! As a valued traveler with ${targetAgency.name}, we have assigned premium seats for your group.`,
            messageType: 'text',
            status: 'read',
            createdAt: new Date(Date.now() - 20000 * 1000),
          },
          {
            conversationId: conv._id,
            senderType: 'customer',
            senderId: u._id,
            receiverId: targetAgency._id,
            text: `Pickup location has been updated. Looking forward to it!`,
            messageType: 'text',
            status: i === 0 ? 'delivered' : 'read',
            createdAt: new Date(Date.now() - 5000 * 1000),
          },
        ];

        const createdMsgs = await MessageModel.insertMany(msgDocs);

        // Update conversation lastMessageId
        conv.lastMessageId = createdMsgs[createdMsgs.length - 1]._id;
        conv.lastMessagePreview = createdMsgs[createdMsgs.length - 1].text;
        conv.lastMessageAt = createdMsgs[createdMsgs.length - 1].createdAt;
        await conv.save();

        // Seed Private Staff Notes
        await AgencyPrivateNoteModel.deleteMany({
          agencyId: targetAgency._id,
          customerId: u._id,
        });

        if (i === 0) {
          await AgencyPrivateNoteModel.create([
            {
              agencyId: targetAgency._id,
              customerId: u._id,
              bookingId: b?._id,
              authorAdmin: {
                id: targetAgency._id,
                name: targetAgency.ownerName || 'Staff Admin',
                email: targetAgency.email,
              },
              note: 'Vegetarian meals requested for all group travelers.',
            },
            {
              agencyId: targetAgency._id,
              customerId: u._id,
              bookingId: b?._id,
              authorAdmin: {
                id: targetAgency._id,
                name: targetAgency.ownerName || 'Staff Admin',
                email: targetAgency.email,
              },
              note: 'VIP Traveler — front row seat allocation in vehicle.',
            },
          ]);
        } else if (i === 1) {
          await AgencyPrivateNoteModel.create([
            {
              agencyId: targetAgency._id,
              customerId: u._id,
              bookingId: b?._id,
              authorAdmin: {
                id: targetAgency._id,
                name: targetAgency.ownerName || 'Staff Admin',
                email: targetAgency.email,
              },
              note: 'Solo female traveler — assigned single room accommodation.',
            },
          ]);
        }
      }
    }

    console.log('\n🎉 Real MongoDB Conversation Data Successfully Seeded!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedAgencyConversations();
