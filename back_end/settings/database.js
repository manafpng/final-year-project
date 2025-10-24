const mysql = require("mysql2");

// Create a connection pool to manage multiple MySQL connections efficiently
const pool = mysql.createPool({
  host: "localhost",             // Database host
  user: "root",                  //  MySQL username
  password: "",                  //  MySQL password
  database: "password_manager",  // Name of the database
  waitForConnections: true,      // Queue connection requests if no connections are available
  connectionLimit: 10,           // Maximum number of connections in the pool
  queueLimit: 0                  // No limit on queued requests
});

// Promisify the pool to use async/await syntax throughout the app
const promisePool = pool.promise();

module.exports = promisePool;
