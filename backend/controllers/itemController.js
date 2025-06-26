// backend/controllers/itemController.js

const ItemRequest = require('../models/ItemRequest');
const User = require('../models/User'); // Still needed for vendor search

// Admin: Search vendors by port (Similar to drivers, might move to userController)
exports.getVendorsByPort = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor', portName: req.params.portName });
        res.json(vendors);
    } catch (err) {
        console.error('Error fetching vendors by port:', err);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

// Admin: Create item request and assign vendor
exports.createItemRequest = async (req, res) => {
    try {
        const { itemName, category, quantity, notes, shipName, portName, eta, imageUrl, assignedVendor } = req.body;

        const itemRequest = new ItemRequest({
            itemName,
            category,
            quantity,
            notes,
            shipName,
            portName,
            eta,
            imageUrl,
            assignedVendor,
            requestedBy: req.user._id,
        });

        await itemRequest.save();
        res.status(201).json(itemRequest);
    } catch (err) {
        console.error('Error creating item request:', err);
        res.status(500).json({ error: 'Failed to create item request' });
    }
};

// Admin: View all item requests created by admin with vendor status
exports.getAdminItemRequests = async (req, res) => {
    try {
        const requests = await ItemRequest.find({ requestedBy: req.user._id })
            .populate('assignedVendor', 'name email portName')
            .exec();
        res.json(requests);
    } catch (err) {
        console.error('Error fetching admin item requests:', err);
        res.status(500).json({ error: 'Failed to fetch item requests' });
    }
};

// Admin: Update item request status (Submitted → Confirmed → Delivered)
exports.updateItemRequestStatus = async (req, res) => {
    try {
        const updatedRequest = await ItemRequest.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedRequest);
    } catch (err) {
        console.error('Error updating item request status:', err);
        res.status(500).json({ error: 'Failed to update item request status' });
    }
};

// Vendor: View assigned item requests (filtered by vendor and port)
exports.getVendorAssignedRequests = async (req, res) => {
    try {
        const requests = await ItemRequest.find({ assignedVendor: req.user._id })
            .populate('requestedBy', 'name email')
            .exec();
        res.json(requests);
    } catch (err) {
        console.error('Error fetching vendor assigned requests:', err);
        res.status(500).json({ error: 'Failed to fetch assigned item requests' });
    }
};

// Vendor: Accept or reject assigned item request
exports.updateVendorAcceptanceStatus = async (req, res) => {
    try {
        const { accept } = req.body; // boolean: true=accept, false=reject
        const status = accept ? 'Confirmed' : 'Rejected';

        const updatedRequest = await ItemRequest.findOneAndUpdate(
            { _id: req.params.id, assignedVendor: req.user._id },
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Item request not found or not assigned to you' });
        }

        res.json(updatedRequest);
    } catch (err) {
        console.error('Error updating vendor acceptance status:', err);
        res.status(500).json({ error: 'Failed to update acceptance status' });
    }
};

// Crew: Submit basic item request (no vendor assignment at this stage)
exports.crewSubmitItemRequest = async (req, res) => {
    try {
        const { itemName, quantity } = req.body;

        if (!itemName || !quantity) {
            return res.status(400).json({ message: 'Item name and quantity are required.' });
        }

        const itemRequest = new ItemRequest({
            itemName,
            quantity,
            status: 'Submitted',
            requestedBy: req.user._id,
            shipName: req.user.shipName || 'Unknown',
            portName: req.user.portName || 'Unknown',
        });

        await itemRequest.save();
        res.status(201).json({ message: 'Item request submitted successfully', item: itemRequest });
    } catch (err) {
        console.error('Error submitting item request:', err);
        res.status(500).json({ message: 'Server error submitting item request' });
    }
};

exports.getCrewItemRequests = async (req, res) => {
  try {
    const reqs = await ItemRequest.find({ requestedBy: req.user._id })
      .populate('assignedVendor', 'name email')
      .exec();
    res.json(reqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your item requests' });
  }
};

