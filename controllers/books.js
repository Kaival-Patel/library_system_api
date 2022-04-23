const mysql = require("mysql");
const upload = require("../multer");
const express = require("express");
const { route } = require("express/lib/application");
const sqlpool = require("../sql_pool");
const isTokenValid = require("./token_guard");
const router = express.Router();
const db = "books";

router.post(
  "/books/new",
  upload.single("cover"),
  async function (req, res, next) {
    const { name, author, price, isbn } = req.body;
    const { token } = req.headers;
    isTokenValid(token)
      .then((result) => {
        sqlpool.query(
          `INSERT INTO ${db} (name,author,price,isbn,status,cover) VALUES (?,?,?,?,?,?)`,
          [name, author, price, isbn, 1, req.file.filename],
          (err, result, fields) => {
            console.log(err);
            if (err) {
              res.status(200).json({ e: "Somethings wrong" });
            } else {
              res.status(200).json({ m: "Inserted" });
            }
          }
        );
      })
      .catch((err) => {
        res.status(200).json({ m: "Token Missing" });
      });
  }
);

module.exports = router;
