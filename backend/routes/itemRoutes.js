// backend/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); // Import the new controller
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Admin: Search vendors by port
router.get('/vendors/by-port/:portName', protect, authorizeRoles('admin', 'crew'), itemController.getVendorsByPort); // Added 'crew' role as they will request items.

// // Admin: Create item request and assign vendor
// router.post('/create', protect, authorizeRoles('admin'), itemController.createItemRequest);

// Admin: View all item requests created by admin with vendor status
router.get('/admin/requests', protect, authorizeRoles('admin','crew'), itemController.getAdminItemRequests);

// ✅ Updated — allow crew to assign vendor
router.post('/create', protect, authorizeRoles('admin', 'crew'), itemController.createItemRequest);

// Crew: Submit item request
router.post('/request', protect, authorizeRoles('crew'), itemController.crewSubmitItemRequest);


// Admin: Update item request status (Submitted → Confirmed → Delivered)
router.put('/:id/status', protect, authorizeRoles('admin'), itemController.updateItemRequestStatus);

// Vendor: View assigned item requests (filtered by vendor and port)
router.get('/vendor/assigned', protect, authorizeRoles('vendor'), itemController.getVendorAssignedRequests);

// Vendor: Accept or reject assigned item request
router.put('/:id/accept', protect, authorizeRoles('vendor'), itemController.updateVendorAcceptanceStatus);

router.get('/crew/my-requests', protect, authorizeRoles('crew'), itemController.getCrewItemRequests);


module.exports = router;