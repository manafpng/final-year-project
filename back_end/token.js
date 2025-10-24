const crypto = require("crypto");

// Generate a secure 256-bit random key
const key = crypto.randomBytes(32);

// Output the key in hexadecimal format for use in environment variables
console.log("Generated ENCRYPTION_KEY:", key.toString("hex"));
