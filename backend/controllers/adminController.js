const Shipment = require('../models/Shipment');
const TrackingLog = require('../models/TrackingLog');

// @desc    Update shipment status and add tracking log
// @route   PUT /api/admin/shipments/:id/status
// @access  Private/Admin
const updateShipmentStatus = async (req, res) => {
  try {
    const { status, location, description } = req.body;
    const { id } = req.params;

    if (!status || !location || !description) {
      return res.status(400).json({ success: false, message: 'Please provide status, location, and description' });
    }

    // Find shipment
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Update shipment fields
    shipment.status = status;
    shipment.currentAddress = location;
    await shipment.save();

    // Create a new tracking log coordinate
    const log = await TrackingLog.create({
      shipment: shipment._id,
      status,
      location,
      description
    });

    res.json({
      success: true,
      message: 'Shipment updated successfully',
      data: {
        shipment,
        log
      }
    });
  } catch (error) {
    console.error('❌ Admin Update Shipment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateShipmentStatus
};
