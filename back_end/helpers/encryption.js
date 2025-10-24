const crypto = require("crypto");

// Encryption key must be 32 bytes (hex format expected from environment)
const crypto_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const IV_LENGTH = 16; // AES block size for CBC mode

/**
 * Encrypts a plain text string using AES-256-CBC.
 * Returns the result as a hex IV concatenated with the encrypted data.
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string in the format iv:encryptedData
 */
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", crypto_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with AES-256-CBC.
 * Expects the input format to be iv:encryptedData
 * @param {string} text - Encrypted string
 * @returns {string} Decrypted plain text
 */
function decrypt(text) {
  const [ivHex, ...encryptedParts] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = encryptedParts.join(":");

  const decipher = crypto.createDecipheriv("aes-256-cbc", crypto_KEY, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
