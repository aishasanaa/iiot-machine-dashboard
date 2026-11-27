// Run this once to seed the MongoDB database: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Machine = require('./models/Machine');
const connectDB = require('./db');

const seedData = [
  {
    id: 'M-101',
    name: 'CNC Lathe 1',
    status: 'running',
    temperature: 68,
    vibration: 2.1,
    lastUpdated: new Date('2026-07-23T09:00:00Z'),
  },
  {
    id: 'M-102',
    name: 'Hydraulic Press',
    status: 'fault',
    temperature: 92,
    vibration: 6.8,
    lastUpdated: new Date('2026-07-23T09:01:00Z'),
  },
  {
    id: 'M-103',
    name: 'Conveyor Belt A',
    status: 'idle',
    temperature: 40,
    vibration: 0.3,
    lastUpdated: new Date('2026-07-23T09:02:00Z'),
  },
  {
    id: 'M-104',
    name: 'Welding Robot',
    status: 'running',
    temperature: 75,
    vibration: 3.4,
    lastUpdated: new Date('2026-07-23T09:03:00Z'),
  },
];

const seed = async () => {
  await connectDB();
  // Clear existing data then insert fresh seed
  await Machine.deleteMany({});
  await Machine.insertMany(seedData);
  console.log('✅ Database seeded with 4 machines!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
