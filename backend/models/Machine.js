const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['running', 'idle', 'fault'],
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    vibration: {
      type: Number,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Removes __v field from responses
    versionKey: false,
  }
);

module.exports = mongoose.model('Machine', machineSchema);
