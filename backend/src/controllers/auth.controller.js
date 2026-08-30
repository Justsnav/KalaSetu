const asyncHandler = require('../utils/asyncHandler');
const user = require('../models/user');
const Product = require('../models/product');
const generateToken = require('../utils/generateToken');

// Signup route
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await user.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: 'User with this email already exists.'
    });
  }

  const newUser = await user.create({
    name,
    email,
    password,
    role: role || 'buyer'
  });

  const token = generateToken(newUser._id);

  return res.status(201).json({
    message: 'User created successfully',
    token
  });
});

// Signin route
const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await user.findOne({ email }).select('+password');
  if (!existingUser) {
    return res.status(401).json({
      message: 'Incorrect Credential'
    });
  }
  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      message: 'Incorrect Credential'
    });
  }
  const token = generateToken(existingUser._id);
  res.json({
    token
  });
});

// Get current user route
const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});

// Update Profile route
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'profileImage',
    'location',
    'craft',
    'artForm',
    'bio',
    'story',
    'experience',
    'phone',
    'address'
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  updateData.updatedAt = Date.now();

  const updatedUser = await user.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

// Change Password route
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: 'Please provide current and new passwords.'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: 'New password must be at least 6 characters.'
    });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({
      message: 'New passwords do not match.'
    });
  }

  const currentUser = await user.findById(req.user._id).select('+password');
  if (!currentUser) {
    return res.status(404).json({
      message: 'User not found.'
    });
  }

  const isMatch = await currentUser.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      message: 'Current password is incorrect.'
    });
  }

  currentUser.password = newPassword;
  await currentUser.save();

  res.json({
    message: 'Password changed successfully.'
  });
});

// Get all artisans for Stories page
const getArtisans = asyncHandler(async (req, res) => {
  const artisans = await user.find({ role: 'artisan' }).select('-password');
  res.json({
    artisans
  });
});

// Get single artisan profile and their products
const getArtisanById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artisan = await user.findOne({ _id: id, role: 'artisan' }).select('-password');
  if (!artisan) {
    return res.status(404).json({
      message: 'Artisan not found'
    });
  }

  const products = await Product.find({ artistId: id });

  res.json({
    artisan,
    products
  });
});

module.exports = {
  signup,
  signin,
  getMe,
  updateProfile,
  changePassword,
  getArtisans,
  getArtisanById
};