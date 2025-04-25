// Controller.js
const User = require('./users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET

// Register a new user using name, homeCity, email, and password
exports.register = async (req, res) => {
  const { name, homeCity, email, password } = req.body;
  try {
    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    // Create a new user with default profile, favorites, and concerts
    const newUser = new User({
      name,
      homeCity,
      email,
      password: hash,
      profile: {},
      favorites: [],
      concerts: []
    });
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.status(201).json({ message: 'User registered successfully', token, user: newUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User already exists with that email.' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Login an existing user (using email for login)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ message: 'Logged in successfully', token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  // Expect token format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};
// Logout the user (JWT logout can be handled client-side or via token blacklist if needed)
exports.logout = (req, res) => {
  // For JWT, there's no built-in logout; client can simply discard the token.
  res.json({ message: 'Logged out successfully' });
};

// Change the user password
exports.changePassword = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: 'Not logged in' });
  
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }
  
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
    
    // Update password with new hash
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET user profile (protected route)
exports.getProfile = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data including _id
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      homeCity: user.homeCity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile (protected route)
exports.updateProfile = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};