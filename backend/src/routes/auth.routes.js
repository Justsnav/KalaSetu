const express = require('express');
const router = express.Router();
const { signup, signin, getMe } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');


router.post("/signup", signup);
router.post("/login", signin);
router.get("/me", protect, getMe);

module.exports = router;