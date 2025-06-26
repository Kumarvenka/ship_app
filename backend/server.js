// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const itemRoutes = require('./routes/itemRoutes');
const cabRoutes = require('./routes/cabRoutes');
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(cors());
app.use(express.json()); 


app.use('/api/items', itemRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/auth', authRoutes);




// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to OneMarineX Backend API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
