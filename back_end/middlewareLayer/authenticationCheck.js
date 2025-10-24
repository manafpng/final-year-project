const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token in the Authorization header.
 * Attaches decoded user info to `req.user` if token is valid.
 */
exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for a properly formatted Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided, authorization denied.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to the request for downstream use
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Token is not valid." });
  }
};
