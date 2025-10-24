// Database connection configuration and encryption helpers
const db = require("../settings/database");
const { encrypt, decrypt } = require("../helpers/encryption");

class PasswordModel {
  /**
   * Save user's password after encryption, then store it in the database
   * @param {number} userId
   * @param {string} username
   * @param {string} website
   * @param {string} password
   */
  static async savePassword(userId, username, website, password) {
    const encryptedPassword = encrypt(password);
    const query = `
      INSERT INTO passwords (user_id, username, website, password)
      VALUES (?, ?, ?, ?)
    `;

    try {
      await db.query(query, [userId, username, website, encryptedPassword]);
      return { message: "Password saved successfully." };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all credentials for a user after decrypting the passwords
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  static async getPasswordsByUserId(userId) {
    const query = `
      SELECT id, username, website, password, created_at
      FROM passwords
      WHERE user_id = ?
    `;

    try {
      const [rows] = await db.query(query, [userId]);
      return rows.map((row) => {
        try {
          return {
            id: row.id,
            username: row.username,
            website: row.website,
            created_at: row.created_at,
            password: decrypt(row.password),
          };
        } catch (error) {
          console.error("Decryption error for row:", row);
          console.error("Decryption error details:", error);
          return {
            id: row.id,
            username: row.username,
            website: row.website,
            created_at: row.created_at,
            password: "Failed to decrypt",
          };
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific credential by website
   * @param {number} userId
   * @param {string} website
   * @returns {Promise<Object|null>}
   */
  static async getPasswordByWebsite(userId, website) {
    const query = `
      SELECT username, password
      FROM passwords
      WHERE user_id = ? AND website = ?
      LIMIT 1
    `;

    try {
      const [rows] = await db.query(query, [userId, website]);
      if (rows.length > 0) {
        return {
          website,
          username: rows[0].username,
          password: decrypt(rows[0].password),
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a password entry by its ID
   * @param {number} id
   * @returns {Promise}
   */
  static async deleteById(id) {
    try {
      return await db.query("DELETE FROM passwords WHERE id = ?", [id]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing password record
   * @param {number} id
   * @param {number} userId
   * @param {string} website
   * @param {string} username
   * @param {string} password
   * @returns {Promise}
   */
  static async updatePassword(id, userId, website, username, password) {
    const encrypted = encrypt(password);
    const query = `
      UPDATE passwords
      SET website = ?, username = ?, password = ?
      WHERE id = ? AND user_id = ?
    `;

    try {
      const [result] = await db.query(query, [website, username, encrypted, id, userId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PasswordModel;
