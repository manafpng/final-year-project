const express = require("express");
const router = express.Router();

// Middleware for JWT authentication
const { isAuthenticated } = require("../middlewareLayer/authenticationCheck");

// Credential handlers
const {
  getUserPasswords,
  addPassword,
  getWebsitePassword,
  deletePassword,
  updatePassword
} = require("../handlers/credential_handler");

/**
 * @route   GET /passwords
 * @desc    Retrieve all saved credentials for the authenticated user
 * @access  Private
 */
router.get("/passwords", isAuthenticated, getUserPasswords);

/**
 * @route   POST /passwords
 * @desc    Add a new credential for the authenticated user
 * @access  Private
 */
router.post("/passwords", isAuthenticated, addPassword);

/**
 * @route   GET /passwords/:website
 * @desc    Retrieve credentials for a specific website
 * @access  Private
 */
router.get("/passwords/:website", isAuthenticated, getWebsitePassword);

/**
 * @route   DELETE /passwords/:id
 * @desc    Delete a saved credential by its ID
 * @access  Private
 */
router.delete("/passwords/:id", isAuthenticated, deletePassword);

/**
 * @route   PUT /passwords/:id
 * @desc    Update a saved credential
 * @access  Private
 */
router.put("/passwords/:id", isAuthenticated, updatePassword);

module.exports = router;
