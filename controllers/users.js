const express = require("express");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../multer");
const pool = require("../sql_pool");
const sqlpool = require("../sql_pool");
const bcryptjs = require("bcryptjs");
require("dotenv/config");
const db = "users";
router.post("/user/register", upload.none(), async function (req, res, next) {
  const { name, type, email, password } = req.body;
  //generate hash
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  //generate token
  const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET);
  try {
    pool.query(
      `INSERT INTO ${db} (name,type,email,password,token) VALUES (?,?,?,?,?)`,
      [name, type, email, hashedPass, token],
      (err, row, field) => {
        if (err) {
          console.error(err);
          res.status(200).json({ e: err.message });
        } else {
          res.status(200).json({ m: "Registered Successfully", token: token });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(200).json({ e: "Error while registering user" });
  }
});

router.post("/user/login", upload.none(), async function (req, res, next) {
  var parsedData = JSON.parse(JSON.stringify(req.body));
  const { email, password } = parsedData;
  sqlpool.query(
    `SELECT * FROM ${db} WHERE email = '${email}'`,
    (err, rows, fields) => {
      if (err) {
        console.error(err);
        res.status(200).json({ e: err.message });
      } else {
        if (rows.length > 0) {
          const validPass = bcryptjs.compareSync(password, rows[0].password);
          if (validPass) {
            res.status(200).json({ m: "Logged In", r: rows[0].token });
          } else {
            res.status(200).json({ m: "Invalid Credentials" });
          }
        } else {
          res.status(200).json({ m: "Invalid Credentials" });
        }
      }
    }
  );
});

module.exports = router;
