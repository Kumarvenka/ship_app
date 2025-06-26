const mongoose = require('mongoose');
const cabRequestSchema = new mongoose.Schema({
  portName: String,
  shipName: String,
  contactNumber: String,
  pickupTime: String,
  pickupLocation: String,
  dropLocation: String,
  status: {
    type: String,
    default: 'Requested', // Requested → Confirmed → Completed
  },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CabRequest', cabRequestSchema);
