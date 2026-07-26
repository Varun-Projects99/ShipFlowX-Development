const Shipment = require('../models/Shipment');
const TrackingLog = require('../models/TrackingLog');

// Helper to generate a unique tracking number
const generateTrackingNumber = () => {
  const chars = '0123456789';
  let randStr = '';
  for (let i = 0; i < 7; i++) {
    randStr += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SFX-${randStr}`;
};

// @desc    Create a new shipment (Book Shipment)
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
  try {
    const { senderDetails, receiverDetails, packageDetails, paymentDetails } = req.body;

    if (!senderDetails || !receiverDetails || !packageDetails || !paymentDetails) {
      return res.status(400).json({ success: false, message: 'Please provide all shipment details' });
    }

    const trackingNumber = generateTrackingNumber();

    // Create shipment
    const shipment = await Shipment.create({
      user: req.user.id,
      trackingNumber,
      senderDetails,
      receiverDetails,
      packageDetails,
      paymentDetails: {
        ...paymentDetails,
        status: 'Paid', // Assuming payment succeeds in simulation
        paymentDate: new Date()
      }
    });

    // Create initial tracking log
    await TrackingLog.create({
      shipment: shipment._id,
      status: 'Booked',
      location: senderDetails.city + ', ' + senderDetails.country,
      description: 'Shipment booking created. Awaiting dispatch.'
    });

    res.status(201).json({
      success: true,
      message: 'Shipment booked successfully',
      data: shipment
    });
  } catch (error) {
    console.error('❌ Create Shipment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's shipments
// @route   GET /api/shipments
// @access  Private
const getUserShipments = async (req, res) => {
  try {
    // If admin, they can see all shipments in the system. If customer, only their own.
    let shipments;
    if (req.user.role === 'admin') {
      shipments = await Shipment.find().populate('user', 'name email').sort('-createdAt');
    } else {
      shipments = await Shipment.find({ user: req.user.id }).sort('-createdAt');
    }

    res.json({
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (error) {
    console.error('❌ Get User Shipments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get shipment by tracking number
// @route   GET /api/shipments/track/:trackingNumber
// @access  Public
const getShipmentByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Fetch tracking logs
    const logs = await TrackingLog.find({ shipment: shipment._id }).sort('-timestamp');

    res.json({
      success: true,
      data: {
        shipment,
        logs
      }
    });
  } catch (error) {
    console.error('❌ Track Shipment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentByTrackingNumber
};
