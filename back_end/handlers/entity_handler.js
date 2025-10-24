// Handler for user authentication and registration
const services_user = require("../databaseServices/services_user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Register a new user.
 * Calls the service to create a user, then returns a success response.
 * Handles duplicate email error gracefully.
 */
exports.register = async (req, res) => {
  try {
    const user = await services_user.createUser(req.body);
    res.status(201).json({
      message: "Registration successful!",
      user,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Email already exists." });
    } else {
      res.status(500).json({ message: "Error registering user." });
    }
  }
};

/**
 * Authenticate user login.
 * Verifies credentials, generates JWT token, and returns user info.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await services_user.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 3600 } //expiry
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Error during login." });
  }
};
