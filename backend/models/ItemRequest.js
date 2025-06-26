const mongoose = require('mongoose');

const itemRequestSchema = new mongoose.Schema({
  itemName: String,
  category: String, // Food, Medicine, Gadgets, etc.
  quantity: Number,
  notes: String,
  shipName: String,
  portName: String,
  eta: String,
  imageUrl: String,
  status: {
    type: String,
    default: 'Submitted', // Submitted → Confirmed → Delivered
  },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // admin who created request
  assignedVendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // vendor assigned
}, { timestamps: true });

module.exports = mongoose.model('ItemRequest', itemRequestSchema);
