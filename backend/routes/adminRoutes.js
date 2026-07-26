const express = require('express');
const router = express.Router();
const { updateShipmentStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin'));

router.put('/shipments/:id/status', updateShipmentStatus);

module.exports = router;
