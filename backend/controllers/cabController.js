// backend/controllers/cabController.js

const CabRequest = require('../models/CabRequest');
const User = require('../models/User'); // Still needed for driver search

// Crew: Create cab request
exports.createCabRequest = async (req, res) => {
    try {
        const {
            portName,
            shipName,
            contactNumber,
            pickupTime,
            pickupLocation,
            dropLocation,
            assignedDriver,
        } = req.body;

        const cabRequest = new CabRequest({
            portName,
            shipName,
            contactNumber,
            pickupTime,
            pickupLocation,
            dropLocation,
            assignedDriver,
            requestedBy: req.user._id,
        });

        await cabRequest.save();
        res.status(201).json(cabRequest);
    } catch (err) {
        console.error('Error creating cab request:', err);
        res.status(500).json({ error: 'Failed to create cab request' });
    }
};

// Crew: View their cab requests and status
exports.getCrewCabRequests = async (req, res) => {
    try {
        const cabs = await CabRequest.find({ requestedBy: req.user._id })
            .populate('assignedDriver', 'name email portName')
            .exec();
        res.json(cabs);
    } catch (err) {
        console.error('Error fetching crew cab requests:', err);
        res.status(500).json({ error: 'Failed to fetch cab requests' });
    }
};

// Driver: View assigned cab requests
exports.getDriverAssignedCabs = async (req, res) => {
    try {
        const cabs = await CabRequest.find({ assignedDriver: req.user._id })
            .populate('requestedBy', 'name email')
            .exec();
        res.json(cabs);
    } catch (err) {
        console.error('Error fetching driver assigned cabs:', err);
        res.status(500).json({ error: 'Failed to fetch assigned cab requests' });
    }
};

// Driver: Confirm cab booking (update status)
exports.confirmCabRequest = async (req, res) => {
    try {
        const updatedCab = await CabRequest.findOneAndUpdate(
            { _id: req.params.id, assignedDriver: req.user._id },
            { status: 'Confirmed' },
            { new: true }
        );

        if (!updatedCab) {
            return res.status(404).json({ error: 'Cab request not found or not assigned to you' });
        }

        res.json(updatedCab);
    } catch (err) {
        console.error('Error confirming cab request:', err);
        res.status(500).json({ error: 'Failed to confirm cab request' });
    }
};

// Admin: Search drivers by port (This might eventually be moved to a more general 'userController' if more user searches are added)
exports.getDriversByPort = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver', portName: req.params.portName });
        res.json(drivers);
    } catch (err) {
        console.error('Error fetching drivers by port:', err);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
};

// Driver: Accept cab request
exports.acceptCabRequest = async (req, res) => {
    try {
        const cab = await CabRequest.findOneAndUpdate(
            { _id: req.params.id, assignedDriver: req.user._id },
            { status: 'Accepted' },
            { new: true }
        );
        if (!cab) return res.status(404).json({ error: 'Cab not found or not assigned to you' });
        res.json(cab);
    } catch (err) {
        console.error('Error accepting cab request:', err);
        res.status(500).json({ error: 'Failed to accept cab request' });
    }
};

// Driver: Decline cab request
exports.declineCabRequest = async (req, res) => {
    try {
        const cab = await CabRequest.findOneAndUpdate(
            { _id: req.params.id, assignedDriver: req.user._id },
            { status: 'Declined' },
            { new: true }
        );
        if (!cab) return res.status(404).json({ error: 'Cab not found or not assigned to you' });
        res.json(cab);
    } catch (err) {
        console.error('Error declining cab request:', err);
        res.status(500).json({ error: 'Failed to decline cab request' });
    }
};

// Alias route for frontend compatibility - can be removed if frontend updates to use /crew
exports.getCrewMyRequests = async (req, res) => {
    try {
        const cabs = await CabRequest.find({ requestedBy: req.user._id })
            .populate('assignedDriver', 'name email portName')
            .exec();
        res.json(cabs);
    } catch (err) {
        console.error('Error fetching crew "my requests" (alias):', err);
        res.status(500).json({ error: 'Failed to fetch cab requests' });
    }
};