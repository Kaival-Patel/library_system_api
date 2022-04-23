const bcrypt = require("bcryptjs/dist/bcrypt");
const pool = require("../sql_pool");
const db = "users";
function isTokenValid(token) {
  return Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM ${db} WHERE token='${token}' LIMIT 1`,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          console.log(rows);
          if (rows.length > 0) {
            resolve(true);
          }
          reject(false);
        }
      }
    );
  });
}

module.exports = isTokenValid;
