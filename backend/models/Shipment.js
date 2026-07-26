const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  senderDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true }
  },
  receiverDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true }
  },
  packageDetails: {
    weight: { type: Number, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    serviceType: {
      type: String,
      enum: ['saver', 'standard', 'express'],
      default: 'standard'
    },
    description: { type: String, default: 'General Freight' }
  },
  status: {
    type: String,
    enum: ['Booked', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Booked'
  },
  currentAddress: {
    type: String,
    default: 'Origin Sorting Center'
  },
  paymentDetails: {
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    amount: { type: Number, required: true },
    method: { type: String, default: 'Credit Card (Simulated)' },
    paymentDate: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
ShipmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
