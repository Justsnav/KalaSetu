const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  getMe,
  updateProfile,
  changePassword,
  getArtisans,
  getArtisanById
} = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

router.post("/signup", signup);
router.post("/login", signin);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.get("/artisans", getArtisans);
router.get("/artisans/:id", getArtisanById);

module.exports = router;