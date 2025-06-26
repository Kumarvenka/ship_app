const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['crew', 'admin', 'vendor', 'driver'],
    required: true
  },
  portName: {
    type: String,
    validate: {
      validator: function (v) {
        // If role is vendor or driver, portName must be non-empty
        if (this.role === 'vendor' || this.role === 'driver') {
          return v && v.trim().length > 0;
        }
        return true; // Not required for other roles
      },
      message: 'Port name is required for vendors and drivers'
    }
  }
});

module.exports = mongoose.model('User', userSchema);
