const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Not authorized, no token'
    });
  }

  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, env.jwtSecret);

  const foundUser = await User.findById(decoded.userId);

  if (!foundUser) {
    return res.status(401).json({
      message: 'Not authorized, user no longer exists'
    });
  }

  req.user = foundUser;
  next();
});

module.exports = protect;