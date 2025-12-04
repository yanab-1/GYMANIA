// backend/controllers/equipmentController.js
const Equipment = require('../models/Equipment');

// @desc    Admin: Get all equipment records
// @route   GET /api/equipment
// @access  Private/Admin
const getEquipment = async (req, res) => {
    const equipmentList = await Equipment.find({});
    res.json(equipmentList);
};

// @desc    Admin: Create new equipment record
// @route   POST /api/equipment
// @access  Private/Admin
const createEquipment = async (req, res) => {
    const { name, identifier, location, status, notes } = req.body;

    if (!name || !identifier) {
        return res.status(400).json({ message: 'Name and Identifier are required.' });
    }

    const equipment = new Equipment({
        name,
        identifier,
        location,
        status,
        notes,
    });

    const createdEquipment = await equipment.save();
    res.status(201).json(createdEquipment);
};

// @desc    Admin: Update equipment status/details (e.g., schedule maintenance)
// @route   PUT /api/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res) => {
    const equipment = await Equipment.findById(req.params.id);

    if (equipment) {
        equipment.status = req.body.status || equipment.status;
        equipment.notes = req.body.notes !== undefined ? req.body.notes : equipment.notes;
        equipment.lastMaintenanceDate = req.body.lastMaintenanceDate || equipment.lastMaintenanceDate;
        
        const updatedEquipment = await equipment.save();
        res.json(updatedEquipment);
    } else {
        res.status(404).json({ message: 'Equipment not found.' });
    }
};

module.exports = { getEquipment, createEquipment, updateEquipment };