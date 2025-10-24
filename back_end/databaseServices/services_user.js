const db = require("../settings/database");
const bcrypt = require("bcryptjs");

class UserModel {
  /**
   * Create a new user after hashing their password
   * @param {Object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {string} param0.password
   * @returns {Promise<Object>}
   */
  static async createUser({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    try {
      const [result] = await db.query(query, [name, email, hashedPassword]);
      return {
        id: result.insertId,
        name,
        email
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Look up a user by their email address
   * Used for login verification and account checks
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  static async findUserByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = ?
      LIMIT 1
    `;

    try {
      const [rows] = await db.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  
}

module.exports = UserModel;
