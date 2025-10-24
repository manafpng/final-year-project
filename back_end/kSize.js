// Load environment variables from .env file
require("dotenv").config();

// Log the encryption key to verify it was loaded correctly
console.log("Loaded ENCRYPTION_KEY:", process.env.ENCRYPTION_KEY);
