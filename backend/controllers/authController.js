const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shipflowx_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Force role to 'customer' to prevent unauthorized admin creation
    const userRole = 'customer';

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('❌ Registration Error:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user (need password explicitly because schema has select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate/Register user via Google SSO (Real token verification)
// @route   POST /api/auth/google
// @access  Public
const { OAuth2Client } = require('google-auth-library');

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google authentication failed: Token missing' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    let email, name;

    // Strict Cryptographic verification using Google official servers
    if (googleClientId) {
      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
    } else {
      // Fallback decode for local testing if GOOGLE_CLIENT_ID is not configured in .env yet
      console.warn('⚠️ GOOGLE_CLIENT_ID is not set in .env. Running in development token decoding mode.');
      const decoded = jwt.decode(token);
      if (!decoded) {
        return res.status(400).json({ success: false, message: 'Google authentication failed: Invalid token' });
      }
      email = decoded.email;
      name = decoded.name || decoded.email.split('@')[0];
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google authentication failed: Email missing from payload' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // If user does not exist, auto-create a Customer account
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: 'customer'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('❌ Google SSO Login Error:', error);
    res.status(500).json({ success: false, message: `Google Sign-in verification failed: ${error.message}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin
};
