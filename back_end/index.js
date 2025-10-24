const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Route modules
const accessRoutes = require("./routeHandlers/access");
const entityRoutes = require("./routeHandlers/entity");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());                 // Enable Cross-Origin Resource Sharing
app.use(express.json());        // Parse incoming JSON payloads

// API Routes
app.use("/api/auth", accessRoutes);   // Routes for registration and login
app.use("/api/user", entityRoutes);   // Routes for user-specific actions

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
