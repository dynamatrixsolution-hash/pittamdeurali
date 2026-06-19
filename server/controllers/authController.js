import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Helper to sign JWT
const generateToken = (id, username) => {
  return jwt.sign(
    { id, username },
    process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production',
    { expiresIn: '30d' }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id, admin.username),
        admin: {
          id: admin._id,
          username: admin.username,
          name: admin.name,
          email: admin.email
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current admin profile (verify token)
// @route   GET /api/auth/verify
// @access  Private
export const verifyAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (admin) {
      res.json({
        success: true,
        admin: {
          id: admin._id,
          username: admin.username,
          name: admin.name,
          email: admin.email
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Setup initial admin account (Only works if no admins exist)
// @route   POST /api/auth/setup
// @access  Public
export const setupAdmin = async (req, res) => {
  try {
    const adminExists = await Admin.findOne();
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin account already exists. Use login endpoint.' });
    }

    const { username, email, password, name } = req.body;
    if (!username || !email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please fill all fields: username, email, password, name' });
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      name
    });

    res.status(201).json({
      success: true,
      token: generateToken(admin._id, admin.username),
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
