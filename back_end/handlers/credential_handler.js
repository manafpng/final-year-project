// Service layer for handling DB operations and encryption
const credential_service = require("../databaseServices/credential_service");

/**
 * Save a new credential (username, password, website) for a user.
 * Extracts user ID from the JWT and sends data to the service layer.
 */
exports.addPassword = async (req, res) => {
  const userId = req.user.id;
  const { username, website, password } = req.body;

  try {
    await credential_service.savePassword(userId, username, website, password);
    res.status(201).json({ message: "Password saved successfully" });
  } catch (error) {
    console.error("Error saving password:", error);
    res.status(500).json({ message: "Failed to save password" });
  }
};

/**
 * Get all stored credentials for the authenticated user.
 * Each password is decrypted in the service before returning.
 */
exports.getUserPasswords = async (req, res) => {
  const userId = req.user.id;

  try {
    const passwords = await credential_service.getPasswordsByUserId(userId);
    res.json(passwords);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    res.status(500).json({ message: "Failed to retrieve passwords" });
  }
};

/**
 * Retrieve a specific password by website for the authenticated user.
 * Used for autofill or preview functionality.
 */
exports.getWebsitePassword = async (req, res) => {
  const userId = req.user.id;
  const { website } = req.params;

  try {
    const passwordData = await credential_service.getPasswordByWebsite(userId, website);
    if (passwordData) {
      res.json(passwordData);
    } else {
      res.status(404).json({ message: "Password for the specified website not found." });
    }
  } catch (error) {
    console.error("Error retrieving website password:", error);
    res.status(500).json({ message: "Failed to retrieve website password" });
  }
};

/**
 * Update a stored password record.
 * Requires the password ID, user ID (from JWT), and updated fields.
 */
exports.updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { website, username, password } = req.body;

  try {
    const result = await credential_service.updatePassword(id, userId, website, username, password);

    if (!result || result.affectedRows === 0) {
      return res.status(400).json({ message: "No record was updated." });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

/**
 * Delete a stored password by its ID.
 */
exports.deletePassword = async (req, res) => {
  const { id } = req.params;

  try {
    await credential_service.deleteById(id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting password:", error);
    res.status(500).json({ message: "Failed to delete the password." });
  }
};
