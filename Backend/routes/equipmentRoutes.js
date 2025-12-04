// backend/routes/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const { getEquipment, createEquipment, updateEquipment } = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin'), getEquipment)
    .post(protect, authorize('admin'), createEquipment);

router.route('/:id')
    .put(protect, authorize('admin'), updateEquipment);

module.exports = router;