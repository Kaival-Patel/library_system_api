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
      `SELECT * FROM ${db} WHERE email='${email}' LIMIT 1`,
      (e, d, f) => {
        if (e) {
          res.status(200).json({ s: 0, m: e.message });
        } else {
          if (d.length > 0) {
            res.status(200).json({ s: 0, m: "Email Already Registered" });
          } else {
            pool.query(
              `INSERT INTO ${db} (name,type,email,password,token) VALUES (?,?,?,?,?)`,
              [name, type, email, hashedPass, token],
              (err, row, field) => {
                if (err) {
                  console.error(err);
                  res.status(200).json({ s: 0, m: err.message });
                } else {
                  res.status(200).json({
                    s: 1,
                    m: "Registered Successfully",
                    r: {
                      token: token,
                      name: name,
                      email: email,
                      type: type,
                    },
                  });
                }
              }
            );
          }
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
        res.status(200).json({ s: 0, e: err.message });
      } else {
        if (rows.length > 0) {
          const validPass = bcryptjs.compareSync(password, rows[0].password);
          if (validPass) {
            res.status(200).json({ s: 1, m: "Logged In", r: {
              token:rows[0].token,
              name:rows[0].name,
              email:rows[0].email,
              type:rows[0].type,
            } });
          } else {
            res.status(200).json({ s: 0, m: "Invalid Credentials" });
          }
        } else {
          res.status(200).json({ s: 0, m: "Invalid Credentials" });
        }
      }
    }
  );
});

module.exports = router;
