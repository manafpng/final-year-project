const express = require("express");
const router = express.Router();

// Authentication handlers
const { register, login } = require("../handlers/entity_handler");

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post("/login", login);

module.exports = router;
