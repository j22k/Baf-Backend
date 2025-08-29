const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUser = async (username, password) => {
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return null; // User not found
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null; // Password does not match
    }

    return user;
  } catch (err) {
    throw new Error('Error fetching user: ' + err.message);
  }
};

const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      role: user.role 
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const verifyToken = (token) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  getUser,
  generateToken,
  verifyToken
};
