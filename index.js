require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const otpGenerator = require('otp-generator');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://aiswaryacb755:Y4Q6jzOlsDkGeJe6@datingapp.udz6kxp.mongodb.net/saath?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// OTP Schema
const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '5m' } // OTP expires in 5 minutes
});

const OTP = mongoose.model('OTP', otpSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  next();
});

// Generate and send OP
app.post('/api/otp', async (req, res) => {
  console.log('OTP Request Body:', req.body);
  try {
    console.log("Phone number received: ")
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate 6-digit OTP
    const otp = otpGenerator.generate(6, { 
      digits: true, 
      alphabets: false, 
      upperCase: false, 
      specialChars: false 
    });

    // Save or update OTP in database
    await OTP.findOneAndUpdate(
      { phone },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    // For development, include OTP in response
    // In production, remove this and send OTP via SMS only
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.status(200).json({ 
      message: 'OTP sent successfully',
      otp: otp // Include OTP in response for testing
    });
    
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ phone, otp });
    
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    res.json({ success: true, message: 'OTP verified successfully' });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Saath API' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Access from other devices: http://192.168.1.2:${PORT}`);
  console.log('Server is listening on:', address);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});
