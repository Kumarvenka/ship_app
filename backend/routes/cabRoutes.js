// backend/routes/cabRoutes.js
const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController'); // Import the new controller
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Crew: Create cab request, assign driver and port
router.post('/request', protect, authorizeRoles('crew'), cabController.createCabRequest);

// Crew: View their cab requests and status
router.get('/crew', protect, authorizeRoles('crew'), cabController.getCrewCabRequests);

// Driver: View assigned cab requests
router.get('/driver/assigned', protect, authorizeRoles('driver'), cabController.getDriverAssignedCabs);

// Driver: Confirm cab booking (update status)
router.put('/:id/confirm', protect, authorizeRoles('driver'), cabController.confirmCabRequest);

// Admin: Search drivers by port (needed for crew when assigning driver)
router.get('/drivers/by-port/:portName', protect, authorizeRoles('crew', 'admin'), cabController.getDriversByPort);

// Driver: Accept cab request
router.put('/:id/accept', protect, authorizeRoles('driver'), cabController.acceptCabRequest);

// Driver: Decline cab request
router.put('/:id/decline', protect, authorizeRoles('driver'), cabController.declineCabRequest);

// Alias route for frontend compatibility
router.get('/crew/my-requests', protect, authorizeRoles('crew'), cabController.getCrewMyRequests);

module.exports = router;