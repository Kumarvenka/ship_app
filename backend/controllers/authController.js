const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, portName } = req.body;

    console.log('Signup Request Body:', req.body); // ✅ Check what's being received

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if ((role === 'driver' || role === 'vendor') && (!portName || portName.trim() === '')) {
      return res.status(400).json({ message: 'Port name is required for drivers and vendors' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      portName: (role === 'driver' || role === 'vendor') ? portName : undefined
    });

    await newUser.save();

    console.log('New user saved:', newUser); // ✅ Log saved user

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup failed:', error); // ✅ Log actual error
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });


    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};
