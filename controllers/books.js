const mysql = require("mysql");
const upload = require("../multer");
const express = require("express");
const { route } = require("express/lib/application");
const sqlpool = require("../sql_pool");
const checkForToken = require("./token_guard");
const router = express.Router();
const db = "books";
//INSERT NEW BOOK
router.post(
  "/books/new",
  upload.single("cover"),
  checkForToken,
  function (req, res, next) {
    const { name, author, price, isbn, pages } = req.body;
    const { token } = req.headers;
    sqlpool.query(
      `INSERT INTO ${db} (name,author,price,isbn,status,cover,pages) VALUES (?,?,?,?,?,?,?)`,
      [name, author, price, isbn, 1, req.file.filename, pages],
      (err, result, fields) => {
        console.log(err);
        if (err) {
          res.status(200).json({ s: 0, m: "Somethings wrong" });
        } else {
          res.status(200).json({ s: 1, m: "Inserted" });
        }
      }
    );
  }
);

router.get("/books/get", upload.none(), checkForToken, (req, res, next) => {
  sqlpool.query(`SELECT * FROM ${db} WHERE status=1`, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.send({ s: 0, m: "Error while getting books" });
    } else {
      res.status(200).json({ s: 1, m: "Success", r: rows });
    }
  });
});

module.exports = router;
