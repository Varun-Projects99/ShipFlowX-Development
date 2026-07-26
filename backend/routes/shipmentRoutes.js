const express = require('express');
const router = express.Router();
const { createShipment, getUserShipments, getShipmentByTrackingNumber } = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createShipment);
router.get('/', protect, getUserShipments);
router.get('/track/:trackingNumber', getShipmentByTrackingNumber);

module.exports = router;
