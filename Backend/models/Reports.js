const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
    address: { type: String }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  pointsAwarded: {
    type: Number,
    default: 20
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for location-based queries
reportSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
reportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);